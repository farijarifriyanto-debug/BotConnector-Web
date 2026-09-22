---
title: FAQ
description: Frequently asked questions about BotConnector's move to goose.
---

### Is BotConnector still local-first?

Yes. Local-first defaults don't change with this migration — prompts stay
on your machine unless you explicitly choose a cloud provider.

### Why rebuild on goose instead of BotConnector's own runtime?

Maintaining a bespoke agent runtime, MCP implementation, and desktop
shell is a lot of surface area to keep production-grade alone. goose
already solves this, in the open, under Apache 2.0, with a much larger
set of maintainers. See [About](../../about/) for the full reasoning.

### Does this change how I use BotConnector day to day?

The goal is no — same local-first workflow, same CLI/desktop surfaces.
Branding changes; behavior doesn't.

### Where can I follow progress?

The [blog](../../blog/) posts updates as the migration moves forward, and
[GitHub Releases](../../download/) is the source of truth for what's actually
shipped.
