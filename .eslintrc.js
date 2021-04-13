module.exports = {
  extends: ["plugin:prettier/recommended"],
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  plugins: ["prettier"],
  globals: {},
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    "prettier/prettier": "error",
    "new-cap": "off",
    "require-jsdoc": "off",
    "guard-for-in": "off",
  },
};
