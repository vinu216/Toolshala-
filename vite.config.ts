import path from "path";
import { copyFile, mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootFaviconAssets = [
  "favicon.svg",
  "favicon-16x16.svg",
  "favicon-32x32.svg",
  "favicon-48x48.svg",
  "apple-touch-icon.svg",
  "android-chrome-192x192.svg",
  "android-chrome-512x512.svg",
  "site.webmanifest",
];

const copyRootFaviconAssets = () => ({
  name: "copy-root-favicon-assets",
  async writeBundle() {
    const outDir = path.resolve(__dirname, "dist");
    await mkdir(outDir, { recursive: true });
    await Promise.all(
      rootFaviconAssets.map((asset) =>
        copyFile(path.resolve(__dirname, asset), path.join(outDir, asset)),
      ),
    );
    await copyFile(path.resolve(__dirname, "favicon.svg"), path.join(outDir, "favicon.ico"));
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), copyRootFaviconAssets()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
