module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    "plugin:vue/essential", "plugin:es-beautifier/standard",
    'prettier'
  ],
  plugins: ["es-beautifier"],
  // add your custom rules here
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "linebreak-style": "off",
    "multiline-block-statements" : "no-error",
    "lines-between-class-members":"off",
    "comma-dangle":"off",
    "multiline-import-specifiers":"off",
    "spaced-comment":"off",
    "multiline-object-properties":"no-error",
    "comma-dangle": ["error", "never"]
  }
}
