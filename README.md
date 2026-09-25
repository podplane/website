# Podplane website

This repository contains the source code for <https://podplane.dev>

See also: <https://github.com/podplane/podplane>

## Redirects

Permanent redirects are declared in `cloudflare.redirects.json` and synchronized
to a Cloudflare Bulk Redirect List. Redirects default to status code `301` and
preserve query strings. Set `status_code` on an entry to use `302`, `307`, or
`308`, or set `preserve_query_string` to `false` to discard the query string.
Preview the configured redirects locally:

```bash
bun run redirects:plan
```

To compare them with Cloudflare or apply them, authenticate the Cloudflare CLI.
Its OAuth credentials are stored outside this repository and refreshed
automatically.

```bash
bunx cf auth login
bun run redirects:plan
bun run redirects:apply
```

For CI, `cf` also supports `CLOUDFLARE_ACCOUNT_ID` and
`CLOUDFLARE_API_TOKEN`. The token needs **Account Filter Lists: Edit** and
**Bulk URL Redirects: Edit** permissions.

The apply command creates or updates the `podplane_website_redirects` list and
its account-level Bulk Redirect Rule. It replaces only that list's contents and
leaves other redirect rules unchanged.
