import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import preact from "@astrojs/preact";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
});
