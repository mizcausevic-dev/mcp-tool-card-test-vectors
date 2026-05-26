# Changelog

## v0.1.0 — 2026-05-27

- Initial release: curated conformance corpus for mcp-tool-card-spec v0.1.
- 10 vectors across 3 categories — 4 valid (one per side-effect class), 4 dirty (destructive-without-approval, malformed-side-effect-class, schema-without-input-spec, malformed-pii-exposure), 2 shape (maximal-all-blocks, minimal-read).
- Library API: `getIndex()`, `listManifests(filter?)`, `loadVector(id)`, `loadVectors(filter?)`, `pathFor(manifest)`. Filter by `category` and/or `expects` (FindingCode).
- 5th and final corpus in the test-vectors set across the 4 Kinetic Gain Suite specs (agent-cards, mcp-tool-card, prompt-provenance, evidence-bundle) + OTel GenAI.
- Node 20/22 CI (lint, typecheck, coverage, build, demo, `npm audit`), AGPL-3.0-or-later, Dependabot.
