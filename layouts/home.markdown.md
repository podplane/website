{{- /* Static header */ -}}
# {{ .Site.Title }}: replicated key-value database backed by object storage.

> Podplane is an Open Source Kubernetes distribution & PaaS you can deploy in a few minutes to your AWS, Google Cloud, or Proxmox VE environment.

- Website: {{ .Site.BaseURL }}
- GitHub: https://github.com/podplane/podplane
- LLMs.txt: {{ .Site.BaseURL }}llms.txt

## Documentation
{{ with .Site.GetPage "/docs" }}
{{- range .RegularPages }}
- [{{ .Title }}]({{ .Permalink | strings.TrimRight "/" }}.md){{ with .Description }}: {{ . }}{{ end }}
{{- end }}
{{ range .Sections }}
### {{ .Title }}
{{ with .Description }}
> {{ . }}
{{ end }}
{{- range .Pages }}
- [{{ .Title }}]({{ .Permalink | strings.TrimRight "/" }}.md){{ with .Description }}: {{ . }}{{ end }}
{{- end }}
{{ end }}
{{- end }}
---

Tip: Append `.md` to any page URL to get the markdown version.
