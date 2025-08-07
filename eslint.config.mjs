// eslint.config.mjs

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  eslint.configs.recommended, // ✅ Not an array – don’t spread
  ...(tseslint.configs.strict ?? []), // ✅ Safe spread if array
  ...(tseslint.configs.stylistic ?? []),

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "no-console": "warn",

      // Disable any-related rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
  },
];
