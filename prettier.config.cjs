/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  singleQuote: false,
  trailingComma: "none",
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: ["^react$", "^@?\w", "^@nixora/(.*)$", "^[./]"]
};
