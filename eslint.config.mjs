import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.extends("react-app", "react-app/jest"),
  // Convert and include any Next.js additional recommended linting, if needed
  ...compat.extends("plugin:@next/next/recommended"),
  // Add any additional customizations
  {
    rules: {
      "flowtype/define-flow-type": "off",
      "flowtype/use-flow-type": "off",
    },
  },
];

export default eslintConfig;
