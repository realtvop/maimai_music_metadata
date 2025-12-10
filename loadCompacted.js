/**
 * Thin compatibility wrapper that points to the built bundle.
 * Build outputs are generated via `npm run build`.
 */
try {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    module.exports = require("./dist/index.cjs");
} catch (error) {
    throw new Error("Built outputs are missing. Please run `npm install` and `npm run build` first.");
}
