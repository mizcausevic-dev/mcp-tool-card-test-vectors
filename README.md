# mcp-tool-card-test-vectors

Curated conformance corpus for [`mcp-tool-card-spec`](https://github.com/mizcausevic-dev/mcp-tool-card-spec) v0.1 consumers. 5th and final corpus in the test-vectors set across the 4 Kinetic Gain Suite specs + OTel GenAI.

> Status: v0.1.0 — 10 vectors across 3 categories. Node 20/22 supported.

## The five-corpora set

| Spec | Test vectors |
|---|---|
| OTel GenAI semantic conventions | [`otel-genai-test-vectors`](https://github.com/mizcausevic-dev/otel-genai-test-vectors) |
| `agent-cards-spec` | [`agent-card-test-vectors`](https://github.com/mizcausevic-dev/agent-card-test-vectors) |
| **`mcp-tool-card-spec`** ← this repo | this repo |
| `prompt-provenance-spec` | [`prompt-provenance-test-vectors`](https://github.com/mizcausevic-dev/prompt-provenance-test-vectors) |
| `evidence-bundle-spec` | [`evidence-bundle-test-vectors`](https://github.com/mizcausevic-dev/evidence-bundle-test-vectors) |

## What's in the corpus

| Category | Count | Description |
|---|---|---|
| `valid` | 4 | One vector per side-effect class (`read`, `mutating`, `external`, `destructive` with proper `human_approval_required: true`). |
| `dirty` | 4 | One spec rule violation per vector — pinned in `expectedFindings`. Notably includes `destructive-without-approval` which violates the spec's allOf clause. |
| `shape` | 2 | `maximal-all-blocks` (every optional populated including performance + cost) + `minimal-read` (required-only floor). |

## Library

```ts
import { listManifests, loadVector, loadVectors } from "mcp-tool-card-test-vectors";

const v = loadVector("destructive-without-approval");
console.log(v.manifest.expectedFindings);   // ["destructive-without-human-approval"]

for (const v of loadVectors({ category: "dirty" })) {
  const findings = myValidator(v.payload).map((f) => f.code);
  for (const expected of v.manifest.expectedFindings ?? []) {
    assert(findings.includes(expected), `${v.manifest.id} → expected ${expected}`);
  }
}
```

## Composes with

- [**`mcp-tool-card-spec`**](https://github.com/mizcausevic-dev/mcp-tool-card-spec) — the schema these vectors conform to (or deliberately violate).
- [**`mcp-tool-card-generator`**](https://github.com/mizcausevic-dev/mcp-tool-card-generator) — produces Tool Cards from MCP servers.
- [**`mcp-tool-card-diff`**](https://github.com/mizcausevic-dev/mcp-tool-card-diff) — compares two cards across versions.
- [**`mcp-tool-card-summary`**](https://github.com/mizcausevic-dev/mcp-tool-card-summary) — analyzes a directory of cards.
- [**`kg-validate-action`**](https://github.com/mizcausevic-dev/kg-validate-action) — per-doc CI validator.

## Develop

```
npm install
npm run lint && npm run typecheck && npm run coverage && npm run build
npm run demo
```

## License

[AGPL-3.0-or-later](LICENSE)
