module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:svelte/recommended',
    'plugin:svelte/prettier',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['import'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'double'],
    'import/default': 'warn',
    'import/no-unresolved': 'warn',
    'import/no-unused-modules': [
      'warn',
      {
        unusedExports: true,
      },
    ],
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
      },
    ],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
  },
};
