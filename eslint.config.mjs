// ESLint 9 flat config. Next 16 removed `next lint`, so eslint runs directly
// (see the `lint` script) using the flat configs eslint-config-next ships:
// core-web-vitals (react, react-hooks, jsx-a11y, next rules) + typescript.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      ".velite/**",
      "public/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default config;
