module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: ['react-app', 'react-app/jest', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'no-const-assign': 'error',
    'no-var': 'error',
    'no-new-object': 'error',
    'object-shorthand': 'error',
    'quote-props': ['error', 'as-needed'],
    'no-prototype-builtins': 'error',
    'prefer-object-spread': 'error',
    'no-array-constructor': 'error',
    'array-callback-return': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': ['error', 'never'],
    'no-eval': 'error',
    'no-useless-escape': 'error',
    'func-style': ['error', 'expression'],
    'no-loop-func': 'error',
    'prefer-rest-params': 'error',
    'no-param-reassign': ['error', { props: true }],
    'prefer-spread': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': ['error', { before: true, after: true }],
    // 'arrow-parens': ['error', 'as-needed'], conflicts with prettier setting
    // 'arrow-body-style': ['error', 'as-needed'], doesn't match with us
    'no-confusing-arrow': 'error',
    'implicit-arrow-linebreak': 'error',
    'no-duplicate-imports': 'error',
    'import/no-mutable-exports': 'error',
    'import/first': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'no-iterator': 'error',
    'no-restricted-syntax': 'error',
    'generator-star-spacing': ['error', { before: true, after: false }],
    'dot-notation': 'error',
    'no-restricted-properties': 'error',
    'no-undef': 'error',
    'one-var': ['error', 'never'],
    'no-multi-assign': 'error',
    'no-plusplus': 'error',
    'no-case-declarations': 'error',
    'no-mixed-operators': 'error',
    'newline-per-chained-call': 'error',
    'no-whitespace-before-property': 'error',
    'no-new-wrappers': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
