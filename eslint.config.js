import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
	{ ignores: ['dist'] },
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: { parserOptions: { ecmaVersion: 'latest', sourceType: 'module' } },
		plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
		rules: {
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		},
	},
];


