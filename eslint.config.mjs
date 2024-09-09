// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
	files: ['**/*.vue', '**/*.ts', '**/*.js'],
	rules: {
		'vue/no-v-html': 'off',
		'vue/max-attributes-per-line': 'off',
		'vue/html-self-closing': 'off',
		'vue/multi-word-component-names': 'off',
		'vue/singleline-html-element-content-newline': 'off',
		'vue/no-multiple-template-root': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'import/order': 'off',
		'vue/html-indent': ['error', 'tab'], // enforce tabs in template
		'indent': ['error', 'tab'], // enforce tabs in script and js files
	},
}).override('nuxt/stylistic', {
	rules: {
		'@stylistic/arrow-parens': 'off',
		'@stylistic/indent-binary-ops': 'off',
		'@stylistic/no-mixed-spaces-and-tabs': 'off',
	},
});
// Your custom configs here
