import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createFiles(fileName) {
  const pascalName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
  const scssFileName = `${pascalName}.module.scss`;
  const astroFileName = `${pascalName}.astro`;

  const scssFilePath = path.join(
    __dirname,
    "..",
    "src",
    "styles",
    "main",
    scssFileName
  );
  const astroFilePath = path.join(
    __dirname,
    "..",
    "src",
    "blocks",
    astroFileName
  );

  const scssContent = `/* Styles for ${pascalName} component */\n`;
  fs.writeFileSync(scssFilePath, scssContent, "utf8");

  const astroContent = `---
---\n\n<h1>${pascalName} Component</h1>\n`;
  fs.writeFileSync(astroFilePath, astroContent, "utf8");

  console.log(`Files created: ${scssFilePath} and ${astroFilePath}`);
}

const fileName = process.argv[2];
if (!fileName) {
  console.error("Please provide a file name");
  process.exit(1);
}

createFiles(fileName);
