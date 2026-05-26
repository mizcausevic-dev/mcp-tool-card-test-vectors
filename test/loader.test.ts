import { describe, expect, it } from "vitest";

import { getIndex, listManifests, loadVector, loadVectors, pathFor } from "../src/loader.js";
import { MANIFESTS } from "../src/manifest.js";

describe("manifest catalogue", () => {
  it("exposes 4 valid + 4 dirty + 2 shape vectors", () => {
    expect(MANIFESTS.filter((m) => m.category === "valid")).toHaveLength(4);
    expect(MANIFESTS.filter((m) => m.category === "dirty")).toHaveLength(4);
    expect(MANIFESTS.filter((m) => m.category === "shape")).toHaveLength(2);
  });

  it("every dirty vector lists at least one expectedFindings entry", () => {
    for (const m of MANIFESTS.filter((x) => x.category === "dirty")) {
      expect(m.expectedFindings ?? []).not.toHaveLength(0);
    }
  });

  it("getIndex returns version + every manifest", () => {
    const idx = getIndex();
    expect(idx.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(idx.vectors).toHaveLength(MANIFESTS.length);
  });

  it("pathFor maps id + category to vectors/<category>/<id>.json", () => {
    const m = MANIFESTS.find((x) => x.id === "read-only-search");
    expect(m).toBeDefined();
    expect(pathFor(m!)).toMatch(/vectors[\\/]valid[\\/]read-only-search\.json$/);
  });
});

describe("listManifests filters", () => {
  it("filters by category", () => {
    expect(listManifests({ category: "valid" }).every((m) => m.category === "valid")).toBe(true);
  });

  it("filters by expected finding code", () => {
    const r = listManifests({ expects: "destructive-without-human-approval" });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe("destructive-without-approval");
  });

  it("returns the full set when no filter is supplied", () => {
    expect(listManifests()).toHaveLength(MANIFESTS.length);
  });
});

describe("loadVector / loadVectors", () => {
  it("loadVector returns manifest + payload conforming to spec required shape", () => {
    const v = loadVector<{ tool_card_version: string; tool: { name: string }; safety: { side_effect_class: string } }>("read-only-search");
    expect(v.payload.tool_card_version).toBe("0.1");
    expect(v.payload.tool.name).toBe("search-vectorstore");
    expect(v.payload.safety.side_effect_class).toBe("read");
  });

  it("loadVector throws on unknown id", () => {
    expect(() => loadVector("does-not-exist")).toThrow(/unknown vector id/);
  });

  it("loadVectors returns every manifest with payload", () => {
    const all = loadVectors();
    expect(all).toHaveLength(MANIFESTS.length);
    for (const v of all) expect(v.payload).toBeDefined();
  });

  it("loadVectors honors filter", () => {
    expect(loadVectors({ category: "dirty" })).toHaveLength(4);
  });
});

describe("vector payload sanity", () => {
  it("valid/destructive-with-approval has destructive + human_approval_required: true", () => {
    const v = loadVector<{ safety: { side_effect_class: string; human_approval_required: boolean } }>("destructive-with-approval");
    expect(v.payload.safety.side_effect_class).toBe("destructive");
    expect(v.payload.safety.human_approval_required).toBe(true);
  });

  it("dirty/destructive-without-approval has destructive + human_approval_required: false", () => {
    const v = loadVector<{ safety: { side_effect_class: string; human_approval_required: boolean } }>("destructive-without-approval");
    expect(v.payload.safety.side_effect_class).toBe("destructive");
    expect(v.payload.safety.human_approval_required).toBe(false);
  });

  it("dirty/malformed-side-effect-class uses an out-of-enum value", () => {
    const v = loadVector<{ safety: { side_effect_class: string } }>("malformed-side-effect-class");
    expect(["read", "mutating", "external", "destructive"]).not.toContain(v.payload.safety.side_effect_class);
  });

  it("dirty/schema-without-input-spec has empty schema block", () => {
    const v = loadVector<{ schema: Record<string, unknown> }>("schema-without-input-spec");
    expect(v.payload.schema.input_schema_uri).toBeUndefined();
    expect(v.payload.schema.input_schema_inline).toBeUndefined();
  });

  it("dirty/malformed-pii-exposure uses an out-of-enum value", () => {
    const v = loadVector<{ safety: { pii_exposure: string } }>("malformed-pii-exposure");
    expect(["none", "low", "medium", "high"]).not.toContain(v.payload.safety.pii_exposure);
  });

  it("shape/maximal-all-blocks populates tested_with[2], performance, cost", () => {
    const v = loadVector<{ tested_with?: unknown[]; performance?: unknown; cost?: unknown }>("maximal-all-blocks");
    expect((v.payload.tested_with ?? []).length).toBeGreaterThanOrEqual(2);
    expect(v.payload.performance).toBeDefined();
    expect(v.payload.cost).toBeDefined();
  });

  it("shape/minimal-read has empty input schema and no audit log locations", () => {
    const v = loadVector<{ schema: { input_schema_inline?: { properties?: Record<string, unknown> } }; audit: { log_locations: unknown[] } }>("minimal-read");
    expect(Object.keys(v.payload.schema.input_schema_inline?.properties ?? {})).toHaveLength(0);
    expect(v.payload.audit.log_locations).toEqual([]);
  });
});
