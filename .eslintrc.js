module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort'],
  extends: ['plugin:@typescript-eslint/recommended'],
  root: true,
  env: { node: true, jest: true },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/member-delimiter-style': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'varsIgnorePattern': '^_', 'argsIgnorePattern': '^_'
      }
    ],
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    'camelcase': 'error',
    'no-console': 'error',
    'require-await': 'error',
    'array-bracket-newline': ['error', 'consistent'],
    'array-bracket-spacing': ['error', 'never'],
    'block-spacing': ['error', 'always'],
    'brace-style': ['error', '1tbs'],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'comma-style': ['error', 'last'],
    'computed-property-spacing': ['error', 'never', { 'enforceForClassMembers': true }],
    'eol-last': ['error', 'always'],
    'func-call-spacing': ['error', 'never'],
    'function-call-argument-newline': ['error', 'consistent'],
    'function-paren-newline': ['error', 'consistent'],
    'jsx-quotes': ['error', 'prefer-single'],
    'keyword-spacing': ['error', { 'before': true, 'after': true }],
    'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
    'max-depth': ['error', 4],
    'max-statements-per-line': ['error', { 'max': 1 }],
    'multiline-ternary': ['warn', 'always-multiline'],
    'new-parens': ['error', 'always'],
    'no-lonely-if': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-assign': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new-object': 'error',
    'no-tabs': 'error',
    'no-unneeded-ternary': 'error',
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': ['error', 'beside'],
    'object-curly-newline': ['error', { 'consistent': true }],
    'object-curly-spacing': ['error', 'always'],
    'operator-assignment': ['error', 'always'],
    'operator-linebreak': ['error', 'after', {
      'overrides': {
        '?': 'before', ':': 'before'
      }
    }],
    'prefer-exponentiation-operator': 'error',
    'prefer-object-spread': 'error',
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'semi': ['error', 'always', { 'omitLastInOneLineBlock': true }],
    'semi-spacing': ['error', { 'before': false, 'after': true }],
    'semi-style': ['error', 'last'],
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', { 'anonymous': 'always', 'named': 'never' }],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': ['error', { 'int32Hint': false }],
    'space-unary-ops': ['error', { 'words': true, 'nonwords': false }],
    'spaced-comment': ['error', 'always'],
    'switch-colon-spacing': ['error', { 'after': true, 'before': false }],
    'template-tag-spacing': ['error', 'never'],
    'unicode-bom': ['error', 'never'],
    'wrap-regex': 'error',
    'no-useless-escape': 'warn',
    'no-prototype-builtins': 'warn',
    'curly': [2, 'all'],
    'prefer-const': [
      'error',
      {
        'destructuring': 'any', 'ignoreReadBeforeAssign': true
      }
    ]
  },
  overrides: [
    {
      'files': ['*.ts', '*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            'groups': [// Side effect imports.
              ['^\\u0000'],

              // Packages `react` related packages come first.
              ['^@?\\w'],
              ['^@r1-backend/\\w'],

              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],

              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ]
          }
        ]
      }
    }
  ]
};
