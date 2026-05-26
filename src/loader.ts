import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { INDEX, MANIFESTS } from "./manifest.js";
import type { FindingCode, LoadedVector, VectorCategory, VectorIndex, VectorManifest } from "./types.js";

const HERE = dirname(fileURLToPath(import.meta.url));

export function pathFor(manifest: VectorManifest): string {
  return resolve(HERE, "..", "vectors", manifest.category, `${manifest.id}.json`);
}

export function listManifests(filter?: { category?: VectorCategory; expects?: FindingCode }): VectorManifest[] {
  return MANIFESTS.filter((m) => {
    if (filter?.category && m.category !== filter.category) return false;
    if (filter?.expects && !(m.expectedFindings ?? []).includes(filter.expects)) return false;
    return true;
  });
}

export function loadVector<T = unknown>(id: string): LoadedVector<T> {
  const manifest = MANIFESTS.find((m) => m.id === id);
  if (!manifest) throw new Error(`unknown vector id: "${id}". Available: ${MANIFESTS.map((m) => m.id).join(", ")}`);
  const payload = JSON.parse(readFileSync(pathFor(manifest), "utf8")) as T;
  return { manifest, payload };
}

export function loadVectors<T = unknown>(filter?: { category?: VectorCategory; expects?: FindingCode }): LoadedVector<T>[] {
  return listManifests(filter).map((m) => loadVector<T>(m.id));
}

export function getIndex(): VectorIndex {
  return INDEX;
}
