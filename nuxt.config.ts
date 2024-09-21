// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			script: ['https://unpkg.com/vue@next', 'https://unpkg.com/@vueup/vue-quill@1.2.0'],
			link: [{ rel: 'stylesheet', href: 'https://unpkg.com/@vueup/vue-quill@1.2.0/dist/vue-quill.snow.prod.cs' }],
		},
	},

	compatibilityDate: '2024-04-03',

	devtools: { enabled: true },

	runtimeConfig: {
		baseUrl: process.env.BASE_URL,
	},

	css: ['~/assets/css/main.css'],

	modules: [
		// https://devtools.nuxtjs.org/
		// https://motion.vueuse.org/nuxt.html
		// https://vueuse.org/

		// https://github.com/nuxt-modules/icon
		'@pinia/nuxt', // https://nuxtseo.com/sitemap/getting-started/how-it-works
		'@nuxt/devtools',
		'@nuxt/image',
		[
			'@nuxtjs/google-fonts',
			{
				families: {
					Nunito: {
						wght: '200..800',
						ital: '200..800',
					},
				},
			},
		],
		'@vueuse/motion/nuxt',
		'@vueuse/nuxt',
		'@nuxt/eslint',
		'@nuxt/ui',
		'@vueuse/nuxt',
		'six-dropzone',
	],

	eslint: {
		config: {
			stylistic: {
				indent: 'tab',
				quotes: 'single',
				semi: true,
				braceStyle: '1tbs',
			},
		},
	},
});
