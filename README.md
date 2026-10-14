# Alstra Research and Education Network

Static landing page for AS212387.

## Cloudflare Pages

This repository is ready to deploy as a static site.

- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank
- Build output directory: `.`

Cloudflare Pages serves `index.html` from the repository root. The `_headers`
file applies basic security headers, and `.well-known/security.txt` is published
at `/.well-known/security.txt`.

The `functions/` directory adds Markdown negotiation for the home page and a
read only MCP resource for the same public geofeed. Cloudflare Pages deploys
these functions automatically when connected to this repository. The API catalog
describes only `GET /geofeed.csv`; no account or write API is offered.

The `Content-Signal` directive permits search and agent input use, while
declining AI training use. If that policy changes, update `robots.txt`.

The DNS-AID record `_mcp._agents.alstra.org` is published as an SVCB record
pointing at `alstra.org` with `alpn="mcp,h2"` and port 443. The MCP Server Card
gives the HTTP path (`/mcp`). DNSSEC is enabled in Cloudflare but remains
pending until the DS record is published and visible at the registrar.

Web Bot Auth is not advertised because this site does not send signed bot
requests. A public signing key without a corresponding signing bot would be
misleading.
