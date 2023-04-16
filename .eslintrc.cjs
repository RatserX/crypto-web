module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:svelte/recommended",
        "prettier"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": ["import"],
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "import/no-unresolved": "warn",
        'import/order': [
          'warn',
          {
            "alphabetize": {
              "order": 'asc',
            },
            'newlines-between': 'always',
          },
        ],
    }
}
