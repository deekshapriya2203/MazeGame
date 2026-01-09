import tseslint from "typescript-eslint";
import path from "path";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: path.resolve(__dirname), // ✅ absolute path
      },
    },
  },
];
