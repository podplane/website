import redirects from "../cloudflare.redirects.json";

const listName = "podplane_website_redirects";
const ruleRef = "podplane_website_redirects";
const apply = process.argv.includes("--apply");

type Redirect = {
  source_url: string;
  target_url: string;
  status_code: 301 | 302 | 307 | 308;
  include_subdomains?: boolean;
  subpath_matching?: boolean;
  preserve_query_string?: boolean;
  preserve_path_suffix?: boolean;
};

type RedirectConfig = Omit<Redirect, "status_code"> & {
  status_code?: Redirect["status_code"];
};

type CloudflareList = {
  id: string;
  name: string;
  kind: string;
};

type CloudflareRule = {
  id: string;
  ref?: string;
  action: string;
  expression: string;
  description?: string;
  enabled?: boolean;
  action_parameters?: unknown;
};

type CloudflareRuleset = {
  id: string;
  rules: CloudflareRule[];
};

type CloudflareAuth = {
  authenticated: boolean;
};

function usage() {
  console.log(`Synchronize Cloudflare Bulk Redirects for podplane.dev.

Usage:
  bun run redirects:plan       Validate and compare without changing Cloudflare
  bun run redirects:apply      Apply the declared redirects

Authentication:
  bunx cf auth login
`);
}

if (process.argv.includes("--help")) {
  usage();
  process.exit(0);
}

const desiredRedirects = validateRedirects(redirects as RedirectConfig[]);
const desiredItems = desiredRedirects.map((redirect) => ({ redirect }));

console.log(`${desiredRedirects.length} redirects declared in cloudflare.redirects.json:`);
for (const redirect of desiredRedirects) {
  const suffix = redirect.subpath_matching ? " (including subpaths)" : "";
  console.log(`  ${redirect.source_url} -> ${redirect.target_url}${suffix}`);
}

const auth = runCF<CloudflareAuth>(["auth", "whoami"], true);
if (!auth?.authenticated) {
  if (apply) {
    throw new Error("Cloudflare authentication is required; run `bunx cf auth login`");
  }
  console.log("\nCloudflare is not authenticated; configuration is valid (local plan only).");
  process.exit(0);
}

const lists = runCF<CloudflareList[]>(["rules", "lists", "list"]);
let list = lists.find((candidate) => candidate.name === listName);

if (list && list.kind !== "redirect") {
  throw new Error(`Cloudflare list ${listName} exists with kind ${list.kind}, expected redirect`);
}

if (!list) {
  console.log(`\nCloudflare list ${listName} does not exist.`);
  if (apply) {
    list = runCF<CloudflareList>([
      "rules",
      "lists",
      "create",
      "--body",
      JSON.stringify({
        name: listName,
        description: "Permanent redirects for podplane.dev",
        kind: "redirect",
      }),
    ]);
    console.log(`Created Cloudflare list ${listName}.`);
  }
}

let listChanged = true;
if (list) {
  const currentItems = runCF<Array<{ redirect: Redirect }>>([
    "rules",
    "lists",
    "items",
    "list",
    "--list-id",
    list.id,
    "--per-page",
    "500",
  ]);
  listChanged = JSON.stringify(normalize(currentItems.map((item) => item.redirect))) !==
    JSON.stringify(normalize(desiredRedirects));
  console.log(`Cloudflare list: ${listChanged ? "update required" : "up to date"}.`);
}

if (apply && list && listChanged) {
  const operation = runCF<{ operation_id: string }>([
    "rules",
    "lists",
    "items",
    "update",
    list.id,
    "--body",
    JSON.stringify(desiredItems),
  ]);
  await waitForOperation(operation.operation_id);
  console.log(`Updated ${listName} with ${desiredRedirects.length} redirects.`);
}

const ruleset = runCF<CloudflareRuleset>([
  "rulesets",
  "account-rulesets",
  "phases",
  "get",
  "http_request_redirect",
], true);
const desiredRule = {
  ref: ruleRef,
  description: "Apply permanent redirects for podplane.dev",
  expression: `http.request.full_uri in $${listName}`,
  action: "redirect",
  action_parameters: {
    from_list: { name: listName, key: "http.request.full_uri" },
  },
  enabled: true,
};
const currentRule = ruleset?.rules.find((rule) => rule.ref === ruleRef);
const ruleChanged = !currentRule || !sameRule(currentRule, desiredRule);

console.log(`Cloudflare Bulk Redirect Rule: ${ruleChanged ? "update required" : "up to date"}.`);

if (apply && !ruleset) {
  runCF([
    "rulesets",
    "account-rulesets",
    "create",
    "--body",
    JSON.stringify({
      name: "Cloudflare account-level redirects",
      description: "Account-level Bulk Redirect Rules",
      kind: "root",
      phase: "http_request_redirect",
      rules: [desiredRule],
    }),
  ]);
  console.log("Created the account-level Bulk Redirect Ruleset and Podplane rule.");
} else if (apply && ruleset && !currentRule) {
  runCF([
    "rulesets",
    "account-rulesets",
    "rules",
    "create",
    ruleset.id,
    "--body",
    JSON.stringify(desiredRule),
  ]);
  console.log("Created the Podplane Bulk Redirect Rule.");
} else if (apply && ruleset && currentRule && ruleChanged) {
  runCF([
    "rulesets",
    "account-rulesets",
    "rules",
    "update",
    currentRule.id,
    "--ruleset-id",
    ruleset.id,
    "--body",
    JSON.stringify(desiredRule),
  ]);
  console.log("Updated the Podplane Bulk Redirect Rule.");
}

if (!apply && (listChanged || ruleChanged)) {
  console.log("\nDry run only. Run `bun run redirects:apply` to apply these changes.");
} else if (apply) {
  console.log("\nCloudflare redirects are synchronized.");
} else {
  console.log("\nCloudflare redirects are already synchronized.");
}

function validateRedirects(input: RedirectConfig[]): Redirect[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error("cloudflare.redirects.json must contain at least one redirect");
  }

  const sources = new Set<string>();
  return input.map((redirect, index) => {
    if (!redirect.source_url || !redirect.target_url) {
      throw new Error(`redirect ${index + 1} requires source_url and target_url`);
    }
    if (sources.has(redirect.source_url)) {
      throw new Error(`duplicate redirect source_url: ${redirect.source_url}`);
    }
    sources.add(redirect.source_url);

    const source = new URL(`https://${redirect.source_url.replace(/^https?:\/\//, "")}`);
    const target = new URL(redirect.target_url);
    if (source.hostname !== "podplane.dev" || target.hostname !== "podplane.dev") {
      throw new Error(`redirect ${index + 1} must remain on podplane.dev`);
    }
    const normalized: Redirect = {
      status_code: 301,
      include_subdomains: false,
      subpath_matching: false,
      preserve_query_string: true,
      preserve_path_suffix: false,
      ...redirect,
    };
    if (![301, 302, 307, 308].includes(normalized.status_code)) {
      throw new Error(`redirect ${index + 1} has an unsupported status_code`);
    }
    if (normalized.preserve_path_suffix && !normalized.subpath_matching) {
      throw new Error(`redirect ${index + 1} preserves a path suffix without subpath matching`);
    }

    return normalized;
  });
}

function normalize(input: Redirect[]): Redirect[] {
  return input
    .map((redirect) => ({
      include_subdomains: false,
      subpath_matching: false,
      preserve_query_string: true,
      preserve_path_suffix: false,
      ...redirect,
    }))
    .sort((a, b) => a.source_url.localeCompare(b.source_url));
}

function sameRule(current: CloudflareRule, desired: typeof desiredRule): boolean {
  return current.action === desired.action &&
    current.expression === desired.expression &&
    current.description === desired.description &&
    current.enabled !== false &&
    JSON.stringify(current.action_parameters) === JSON.stringify(desired.action_parameters);
}

async function waitForOperation(operationID: string) {
  for (let attempt = 0; attempt < 80; attempt++) {
    const operation = runCF<{ status: string; error?: string }>([
      "rules",
      "lists",
      "bulk-operations",
      "get",
      operationID,
    ]);
    if (operation.status === "completed") return;
    if (operation.status === "failed") {
      throw new Error(`Cloudflare bulk operation failed: ${operation.error ?? "unknown error"}`);
    }
    await Bun.sleep(750);
  }
  throw new Error(`Cloudflare bulk operation ${operationID} did not complete within 60 seconds`);
}

function runCF<T>(args: string[], allowFailure = false): T {
  const result = Bun.spawnSync(["bunx", "cf", ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const output = result.stdout.toString().trim();
  const error = result.stderr.toString().trim();

  if (result.exitCode !== 0) {
    if (allowFailure) return null as T;
    throw new Error(error || output || `bunx cf exited with status ${result.exitCode}`);
  }

  try {
    return JSON.parse(output) as T;
  } catch {
    throw new Error(`Could not parse bunx cf output as JSON: ${output || error}`);
  }
}
