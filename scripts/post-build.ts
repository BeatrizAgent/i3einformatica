import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");

function processDirectory(dir: string) {
  if (!existsSync(dir)) return;
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file === "index.html") {
      const html = readFileSync(filePath, "utf8");
      if (html.includes('lang="es"')) {
        const updatedHtml = html.replace('lang="es"', 'lang="en"');
        writeFileSync(filePath, updatedHtml, "utf8");
        console.log(`Updated HTML lang attribute to "en" for: ${filePath}`);
      }
    }
  }
}

// Process all files in out/en
const enDir = join(outDir, "en");
if (existsSync(enDir)) {
  processDirectory(enDir);
}
console.log("Post-build HTML lang processing completed.");
