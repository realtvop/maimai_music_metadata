import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs", "iife"],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: false,
    target: "es2020",
    outDir: "dist",
    globalName: "MaimaiMetadata",
    outExtension({ format }) {
        if (format === "esm") {
            return { js: ".mjs" };
        }
        if (format === "cjs") {
            return { js: ".cjs" };
        }
        return { js: ".js" };
    },
});
