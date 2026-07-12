import { extname, join } from "node:path";
import { readFileSync, readdirSync, statSync } from "node:fs";

const roots = ["src", "scripts", "docs", "data/content", "README.md", "AGENTS.md", "DESIGN.md"];
const extensions = new Set([".ts", ".tsx", ".css", ".md", ".json"]);
const mojibake = /[\u00c3\u00c2\ufffd]/u;
const files: string[] = [];

function visit(path: string) {
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) visit(join(path, entry));
  } else if (extensions.has(extname(path)) || path.endsWith(".md")) {
    files.push(path);
  }
}

for (const root of roots) visit(root);

const errors = files.flatMap((file) => mojibake.test(readFileSync(file, "utf8")) ? [`${file}: mojibake or replacement character detected`] : []);
if (errors.length) {
  console.error(`Encoding validation failed (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.info(`Encoding validation passed: ${files.length} maintained text files are valid UTF-8.`);
}
