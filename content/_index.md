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
  Run Containers on VMs in minutes on AWS, Google Cloud, or Proxmox.
{{< /hextra/hero-subtitle >}}

{{< terminal >}}
<div class="flex items-start">
  <span class="text-green-400">➜</span>
  <span class="ml-2">podplane cluster create</span>
</div>

<div class="ml-4 pb-1 text-gray-500">
  > Generated cluster configuration file `podplane.cluster.json`<br />
  > Detected `tofu` command<br />
  > Generated infrastructure configuration `./tf`<br />
  > Deployed cluster "my-cluster" via `tofu apply`<br />
</div>

<div class="flex items-start">
  <span class="text-green-400">➜</span>
  <span class="ml-2">podplane login</span>
</div>

<div class="ml-4 pb-1 text-gray-500">
  > Opening your browser for authentication at https://auth.example.com ...<br />
  > Success! You can now use tools like kubectl with the "my-cluster" context
</div>

<div class="flex items-start">
  <span class="text-green-400">➜</span>
  <span class="ml-2">podplane deploy web --name test --image ghcr.io/podplane/hello:latest</span>
</div>

<div class="ml-4 pb-1 text-gray-500">
  > Deploying web app test using helm...<br />
  > Success! View your app at https://my-cluster.example.com
</div>
{{< /terminal >}}

{{< hextra/hero-subtitle style="margin-top: 2rem; margin-bottom: 2rem; max-width: 50rem;" >}}
  Podplane is an Open Source Kubernetes distribution & PaaS you can run in a few minutes on your public or private cloud, with everything you need to deploy your apps built-in.
{{< /hextra/hero-subtitle >}}

{{< hextra/hero-button text="Get Started" link="/docs/getting-started" style="margin-bottom: 2rem;" >}}
