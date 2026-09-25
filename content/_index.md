---
title: "Podplane: Kubernetes Distribution & PaaS / Open Source Container Platform"
description: "Podplane is an Open Source Kubernetes distribution & PaaS you can deploy in a few minutes to your AWS, Google Cloud, or Proxmox VE environment."
layout: hextra-home
---

{{< hextra/hero-badge >}}
  Open Source, Apache 2.0 licensed
{{< /hextra/hero-badge >}}

{{< hextra/hero-headline style="margin-top: 1.5rem; margin-bottom: 0.5rem;" >}}
  Deploy Your Apps. Secure & Easy.
{{< /hextra/hero-headline >}}

{{< hextra/hero-subtitle style="font-size: 2rem; color: #4b5563; margin-bottom: 2rem;" >}}
  Container PaaS in minutes: AWS, Google Cloud, Proxmox, or Localhost.
{{< /hextra/hero-subtitle >}}

{{< terminal >}}
<div id="terminal-panel-local" role="tabpanel" aria-labelledby="terminal-tab-local" class="space-y-2">
<div class="flex items-start">
  <span class="text-green-400">➜</span>
  <span class="ml-2">brew install podplane/tap/podplane</span>
</div>

<div class="flex items-start pt-1">
  <span class="text-green-400">➜</span>
  <span class="ml-2">podplane local start</span>
</div>

<div class="ml-4 pb-1 text-gray-500">
  > Downloading local cluster dependencies...<br />
  > Kubernetes is ready and kubectl is configured
</div>

<div class="flex items-start">
  <span class="text-green-400">➜</span>
  <span class="ml-2">podplane secret create --for hello secure-message</span>
</div>

<div class="ml-4 pb-1 text-gray-500">
  > Enter secret value (input hidden)<br />
  > Encrypted and stored secret "secure-message" for "hello"
</div>

<div class="flex items-start">
  <span class="text-green-400">➜</span>
  <span class="ml-2">podplane deploy web --name hello \<br />
    &nbsp;&nbsp;--image default-registry.local/mirror/ghcr.io/podplane/hello:latest \<br />
    &nbsp;&nbsp;--hostname hello.default.localhost \<br />
    &nbsp;&nbsp;--secret secure-message \<br />
    &nbsp;&nbsp;-e HELLO_MESSAGE=/var/run/podplane/secrets/secure-message</span>
</div>

<div class="ml-4 text-gray-500">
  > Deploying web app hello...<br />
  > Success! Open <span class="terminal-url">https://hello.<wbr>default.<wbr>localhost:4433/</span>
</div>
</div>

<div id="terminal-panel-aws" role="tabpanel" aria-labelledby="terminal-tab-aws" class="space-y-2" hidden>
<div class="flex items-start">
  <span class="text-green-400">➜</span>
  <span class="ml-2">podplane cluster create</span>
</div>

<div class="ml-4 pb-1 text-gray-500">
  > Generated podplane.cluster.jsonc and infrastructure in ./tf<br />
  > Detected tofu; deployed cluster "my-cluster" with tofu apply
</div>

<div class="flex items-start">
  <span class="text-green-400">➜</span>
  <span class="ml-2">podplane login</span>
</div>

<div class="ml-4 pb-1 text-gray-500">
  > Opening your browser for OIDC authentication...<br />
  > Logged in and configured kubectl context "my-cluster"
</div>

<div class="flex items-start">
  <span class="text-green-400">➜</span>
  <span class="ml-2">podplane push hello:v1</span>
</div>

<div class="ml-4 pb-1 text-gray-500">
  > Pushed registry.example.com/apps/hello:v1
</div>

<div class="flex items-start">
  <span class="text-green-400">➜</span>
  <span class="ml-2">podplane deploy web --name hello \<br />
    &nbsp;&nbsp;--image registry.example.com/apps/hello:v1 \<br />
    &nbsp;&nbsp;--hostname hello.example.com</span>
</div>

<div class="ml-4 pb-1 text-gray-500">
  > Deploying web app hello...<br />
  > Success! Open <span class="terminal-url">https://hello.<wbr>example.com</span>
</div>
</div>
{{< /terminal >}}

{{< hextra/hero-subtitle style="margin-top: 2rem; margin-bottom: 2rem; max-width: 50rem;" >}}
  Podplane is an Open Source Kubernetes distribution & PaaS you can run in a few minutes on your public or private cloud, with everything you need to deploy your apps built-in.
{{< /hextra/hero-subtitle >}}

{{< hextra/hero-button text="Get Started" link="/docs/guides/installation/" style="margin: 0 0.25rem 2rem;" >}}
{{< hextra/hero-button text="Explore Features" link="/docs/features/" variant="secondary" style="margin: 0 0.25rem 2rem;" >}}
