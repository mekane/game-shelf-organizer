import eslintJs from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({
  files: ['**/*.ts', '**/*.tsx'],
  // Extend recommended rule sets from:
  // 1. ESLint JS's recommended rules
  // 2. TypeScript ESLint recommended rules
  extends: [eslintJs.configs.recommended, tseslint.configs.recommended],
  // Configure language/parsing options
  languageOptions: {
    // Use TypeScript ESLint parser for TypeScript files
    parser: tseslint.parser,
    parserOptions: {
      // Enable project service for better TypeScript integration
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
