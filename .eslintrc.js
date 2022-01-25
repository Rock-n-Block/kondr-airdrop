// eslint-disable-next-line import/extensions
const prettierConfig = require('./.prettierrc.js');

module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    createDefaultProgram: true,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2019,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    'import',
    'jsx-a11y',
    'react-hooks',
    '@typescript-eslint',
    'simple-import-sort',
    'prettier',
  ],
  overrides: [
    {
      files: '*.js',
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        camelcase: ['off'],
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowDestructuring: true,
        allowedNames: ['self'],
      },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    'prettier/prettier': ['warn', prettierConfig],
    'quote-props': ['error', 'consistent-as-needed'],
    'react/jsx-uses-react': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/label-has-for': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-wrap-multilines': [
      'warn',
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'ignore',
      },
    ],
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'sort-imports': 'off',
    'no-param-reassign': [
      2,
      {
        props: false,
      },
    ],
    'import/order': 'off',
    'import/no-cycle': 'off',
    'no-debugger': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-confusing-arrow': ['error', { allowParens: false }],
    'no-underscore-dangle': ['error', { allow: ['__typename'] }],
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^react'],
          ['^mobx|redux|store|reducer|RootReducer|react-redux'],
          ['^@?\\w'],
          ['^(@|@company|@ui|components|utils|config|vendored-lib)(/.*|$)'],
          ['^pages|components|index'],
          ['^utils|hooks|store|appConstant|types|services'],
          [
            '^.*\\u0000$',
            '^\\u0000',
            '^\\.\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\./(?=.*/)(?!/?$)',
            '^\\.(?!/?$)',
            '^\\./?$',
          ],
          ['^assets'],
          ['^.+\\.s?css$'],
        ],
      },
    ],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          '{}': false,
        },
      },
    ],
    'no-console': [
      'warn',
      {
        allow: ['debug', 'error'],
      },
    ],
    'no-unused-vars': 'warn',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
