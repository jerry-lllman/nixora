module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier"
  ],
  env: {
    browser: true,
    es2022: true
  },
  ignorePatterns: ["dist", "node_modules", "tailwind.config.ts"],
  rules: {
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }]
  }
};
