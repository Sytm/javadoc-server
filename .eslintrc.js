module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
    },
  },
  plugins: ["@typescript-eslint"],
  rules: {
    strict: ["error", "global"],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars-experimental": "error",
  },
};
