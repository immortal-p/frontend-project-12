export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    env: {
      browser: true,
      es2021: true,
    },
    plugins: ['react', 'functional'],
    extends: [
      'airbnb',
      'plugin:react/recommended',
      'plugin:functional/recommended',
      'plugin:react-hooks/recommended',
    ],
    rules: {
      'import/extensions': 0,
      'import/no-unresolved': 0,
      'react/prop-types': 0,
      'no-console': 0,
      'react/react-in-jsx-scope': 0,
      'functional/no-conditional-statements': 0,
      'functional/no-expression-statements': 0,
      'functional/immutable-data': 0,
      'functional/functional-parameters': 0,
      'functional/no-try-statements': 0,
      'functional/no-throw-statements': 0,
      'functional/no-return-void': 0,
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'testing-library/no-debug': 0,
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    },
  },
];
