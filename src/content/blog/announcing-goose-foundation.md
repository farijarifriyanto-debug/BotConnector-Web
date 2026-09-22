---
title: "BotConnector is moving onto the goose foundation"
description: "Why BotConnector is rebuilding on goose, the open agent runtime from the Agentic AI Foundation, instead of maintaining its own runtime."
pubDate: 2026-09-23
---

BotConnector is migrating its runtime, CLI, and desktop app onto
[goose](https://github.com/aaif-goose/goose), the open-source agent
foundation from the Agentic AI Foundation (part of the Linux Foundation).

Maintaining a bespoke agent runtime, MCP implementation, approval system,
and desktop shell is a lot of surface area for one project to carry alone.
goose already does this well, in the open, under Apache 2.0, with far more
maintainers than BotConnector has on its own.

**What this means in practice:** BotConnector becomes a distribution of
goose — upstream is used as-is, with BotConnector's identity applied at
the branding layer only. No custom UI, no custom runtime, no forked
approval semantics. The local-first philosophy BotConnector started with
carries over unchanged.

We'll post progress here as the migration moves from foundation work to a
public build.
