module.exports = {
  root: true,
  env: {
    // these are overridden on a per glob setup below
    browser: false,
    node: false,
    jest: false,
  },
  extends: [
    // airbnb also contains react rules
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    // keep this last
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'react/prop-types': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unused-params': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'never',
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-implicit-any-catch': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/non-nullable-type-assertion-style': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    // '@typescript-eslint/prefer-readonly-parameter-types': 'error', // nice rule but issue around FB children, fix later
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/sort-type-union-intersection-members': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['node_modules', 'dist', 'build', 'publishingTools', '*/.js'],
  overrides: [
    {
      files: ['tooling/**', '.eslintrc.js', 'jest.config.js'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
      },
    },
    {
      // envs don't seem to work since adding airbnb-typescript but keeping them
      // anyway in the event the issue is fixed, or I work out what I've done wrong
      // I suspect I'm expected to use typescript to check globals
      files: ['electron/**'],
      env: {
        node: true,
      },
    },
    {
      files: ['client/**'],
      env: {
        browser: true,
      },
    },
    {
      files: ['shared/**'],
      env: {
        'shared-node-browser': true,
      },
    },
    {
      files: ['*.spec.ts', '*.spec.tsx'],
      env: {
        jest: true,
        node: true,
      },
      rules: {
        // '@typescript-eslint/no-unsafe-call': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
      },
    },
  ],
};
