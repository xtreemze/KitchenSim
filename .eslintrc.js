module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript
    parserOptions: {
        ecmaVersion: 12, // Allows for parsing modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended', // Base ESLint rules
        'plugin:@typescript-eslint/recommended', // TypeScript-specific rules
    ],
    rules: {
        // Customize your ESLint rules here
        'no-unused-vars': 'off', // Disabled in favor of @typescript-eslint/no-unused-vars
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Ignore unused variables prefixed with "_"
        '@typescript-eslint/explicit-function-return-type': 'off', // Allow inferred return types
        '@typescript-eslint/no-explicit-any': 'warn', // Warn when using "any" type
        '@typescript-eslint/no-empty-function': 'warn', // Warn about empty functions
        'no-console': 'warn', // Warn on console.log statements
        'no-debugger': 'error', // Disallow debugger statements
        'eqeqeq': ['error', 'always'], // Enforce strict equality checks
        'curly': ['error', 'all'], // Enforce consistent use of curly braces
        'semi': ['error', 'always'], // Enforce semicolons
        'quotes': ['error', 'single'], // Enforce single quotes for strings
    },
    settings: {
        // Optional settings for module resolution
    },
};
