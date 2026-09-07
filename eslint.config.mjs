import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import { browser, node } from 'globals';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.turbo/**',
      '**/coverage/**',
      'pnpm-lock.yaml',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    files: ['**/*.{ts,mts,vue}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // 后端与共享包：Node 环境
  {
    files: ['apps/server/**/*.ts', 'packages/**/*.ts'],
    languageOptions: { globals: { ...node } },
  },

  // 前端：浏览器环境
  {
    files: ['apps/web/**/*.{ts,vue}'],
    languageOptions: { globals: { ...browser } },
  },

  // Vue SFC 需要专用 parser 才能解析 <script setup>
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tseslint.parser, ecmaVersion: 'latest', sourceType: 'module' },
    },
  },

  // 测试文件放宽 console 限制
  {
    files: ['**/*.test.ts'],
    rules: { 'no-console': 'off' },
  },
);
