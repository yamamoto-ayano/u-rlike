module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    env: {
      node: true,
      es6: true
    },
    ignorePatterns: ['dist/**', 'node_modules/**', '.wrangler/**'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn'
    }
  };