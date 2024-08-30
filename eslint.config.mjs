// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        rules: {
            // Prefer single quotes.
            'quotes': [2, 'single', { 'avoidEscape': true }],

            // Allow _ prefixed variables to be unused.
            '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],

            // Turn off the rule that suggests using 'interface' over 'type'.
            // 'type' and 'interface' and not interchangeable.
            // This causes issues with Record to object mapping as interfaces.
            // It can't be ignored because @ts-ignore is flagged as an error with
            // the suggestion to use @ts-expect-error instead, which also does not 
            // work because it isn't an error.
            '@typescript-eslint/consistent-type-definitions': 'off',
        }
    }
);

