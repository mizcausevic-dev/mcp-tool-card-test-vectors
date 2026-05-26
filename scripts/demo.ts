import { getIndex, listManifests } from "../src/loader.js";

const idx = getIndex();
console.log(`mcp-tool-card-test-vectors v${idx.version} — ${idx.vectors.length} vectors`);
console.log("");
for (const cat of ["valid", "dirty", "shape"] as const) {
  const ms = listManifests({ category: cat });
  console.log(`## ${cat} (${ms.length})`);
  for (const m of ms) {
    const expected = m.expectedFindings?.length ? `   ← ${m.expectedFindings.join(", ")}` : "";
    console.log(`  - ${m.id}${expected}`);
  }
  console.log("");
}
