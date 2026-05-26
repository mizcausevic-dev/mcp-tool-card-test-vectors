import type { VectorIndex, VectorManifest } from "./types.js";

export const MANIFESTS: VectorManifest[] = [
  // ─── valid ────────────────────────────────────────────────────────────────
  {
    id: "read-only-search",
    category: "valid",
    description: "Read-only vector-store search — minimal-but-realistic Tool Card."
  },
  {
    id: "destructive-with-approval",
    category: "valid",
    description: "Destructive delete-document tool that properly declares human_approval_required: true (spec's allOf clause satisfied)."
  },
  {
    id: "external-email",
    category: "valid",
    description: "External email tool — external_systems populated, tested_with includes a provider/model, performance latency stats."
  },
  {
    id: "mutating-cache",
    category: "valid",
    description: "Mutating but reversible cache invalidation — exercises the `mutating` side-effect class."
  },

  // ─── dirty ────────────────────────────────────────────────────────────────
  {
    id: "destructive-without-approval",
    category: "dirty",
    description: "side_effect_class=destructive but human_approval_required is false (the spec's allOf clause forbids this).",
    expectedFindings: ["destructive-without-human-approval"]
  },
  {
    id: "malformed-side-effect-class",
    category: "dirty",
    description: "side_effect_class uses a value (`kinda-mutating`) not in the spec's enum.",
    expectedFindings: ["malformed-side-effect-class"]
  },
  {
    id: "schema-without-input-spec",
    category: "dirty",
    description: "schema block is empty — has neither input_schema_uri nor input_schema_inline (the spec's oneOf requires one).",
    expectedFindings: ["schema-without-input-spec"]
  },
  {
    id: "malformed-pii-exposure",
    category: "dirty",
    description: "pii_exposure uses a value (`extreme`) not in the spec's enum.",
    expectedFindings: ["malformed-pii-exposure"]
  },

  // ─── shape ────────────────────────────────────────────────────────────────
  {
    id: "maximal-all-blocks",
    category: "shape",
    description: "Every optional block populated — tested_with[2], performance with latency + concurrency, cost block, refusal_modes, multiple audit log locations."
  },
  {
    id: "minimal-read",
    category: "shape",
    description: "Floor: required-only Tool Card with empty input schema and no audit log locations."
  }
];

export const INDEX: VectorIndex = {
  version: "0.1.0",
  generatedAt: "2026-05-27T00:00:00Z",
  vectors: MANIFESTS
};
