module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'next/core-web-vitals'  // Next.jsの場合
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    root: true,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    },
    env: {
      browser: true,
      es6: true,
      node: true
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    ignorePatterns: ['node_modules/**', '.next/**', 'out/**'],
    rules: {
      'react/react-in-jsx-scope': 'off', // Next.jsではReactのimportが不要なため
      'react/prop-types': 'off' // TypeScriptを使用している場合は不要
    }
  };