// Conformance test vectors for mcp-tool-card-spec v0.1 consumers.

export type VectorCategory = "valid" | "dirty" | "shape";

export type FindingCode =
  | "missing-tool-card-version"
  | "wrong-tool-card-version"
  | "missing-tool"
  | "malformed-tool-version"
  | "missing-mcp-server-uri"
  | "missing-schema"
  | "schema-without-input-spec"
  | "missing-safety"
  | "malformed-side-effect-class"
  | "malformed-pii-exposure"
  | "malformed-secrets-exposure"
  | "destructive-without-human-approval"
  | "missing-audit"
  | "tested-with-empty";

export interface VectorManifest {
  id: string;
  category: VectorCategory;
  description: string;
  notes?: string;
  expectedFindings?: FindingCode[];
}

export interface LoadedVector<T = unknown> {
  manifest: VectorManifest;
  payload: T;
}

export interface VectorIndex {
  version: string;
  generatedAt: string;
  vectors: VectorManifest[];
}
