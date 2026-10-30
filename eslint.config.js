import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

const BROWSER_GLOBALS = [
  'window',
  'document',
  'navigator',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'fetch',
  'performance',
  'setTimeout',
  'setInterval',
  'requestAnimationFrame',
  'speechSynthesis',
  'AudioContext',
].map((name) => ({ name, message: 'src/engine is pure: inject this through an interface.' }));

const LAYER = (pattern) => ({
  group: [pattern],
  message: 'Layer boundary violation (see CLAUDE.md).',
});

export default tseslint.config(
  {
    ignores: [
      'dist',
      'dev-dist',
      'node_modules',
      'coverage',
      'playwright-report',
      'test-results',
      'public',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/schema/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            LAYER('**/engine/**'),
            LAYER('**/foundations/**'),
            LAYER('**/features/**'),
            LAYER('**/app/**'),
            LAYER('react*'),
            LAYER('dexie'),
          ],
        },
      ],
    },
  },
  {
    files: ['src/engine/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            LAYER('**/foundations/**'),
            LAYER('**/features/**'),
            LAYER('**/app/**'),
            LAYER('react'),
            LAYER('react-*'),
            LAYER('react/*'),
            LAYER('dexie'),
            LAYER('zustand'),
            LAYER('motion'),
            LAYER('motion/*'),
            LAYER('lottie-web'),
            LAYER('workbox-*'),
            LAYER('virtual:*'),
          ],
        },
      ],
      'no-restricted-globals': ['error', ...BROWSER_GLOBALS],
      'no-restricted-properties': [
        'error',
        { object: 'Date', property: 'now', message: 'Use the injected Clock.' },
        { object: 'Math', property: 'random', message: 'Use the seeded RNG.' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message: 'new Date() reads the wall clock; use the injected Clock.',
        },
      ],
    },
  },
  {
    files: ['src/foundations/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [LAYER('**/features/**'), LAYER('**/app/**')] },
      ],
    },
  },
  {
    files: ['src/features/**'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [LAYER('**/app/**')] }],
    },
  },
);
