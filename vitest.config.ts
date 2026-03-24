import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';

const nuxtProject = await defineVitestProject({
	test: {
		name: 'nuxt',
		include: ['test/nuxt/**/*.{test,spec}.ts'],
		environment: 'nuxt',
		environmentOptions: {
			nuxt: {
				rootDir: fileURLToPath(new URL('.', import.meta.url)),
				domEnvironment: 'happy-dom',
			},
		},
	},
});

export default defineConfig({
	test: {
		projects: [
			{
				test: {
					name: 'unit',
					include: ['test/unit/**/*.{test,spec}.ts'],
					environment: 'node',
				},
			},
			{
				test: {
					name: 'e2e',
					include: ['test/e2e/**/*.{test,spec}.ts'],
					environment: 'node',
				},
			},
			nuxtProject,
		],
	},
});
