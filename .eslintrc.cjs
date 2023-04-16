module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
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
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
      },
    ],
  },
};
