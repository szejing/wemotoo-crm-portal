// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },

	runtimeConfig: {
		hostUrl: process.env.HOST_URL,
	},

	components: [
		// Disable prefixing base components with `Base`
		{ path: '~/components/base', pathPrefix: false },
		// Auto import components from `~/components`
		'~/components',
	],

	css: ['~/assets/css/main.css'],

	modules: [
		// https://devtools.nuxtjs.org/
		// https://motion.vueuse.org/nuxt.html
		// https://vueuse.org/
		'@nuxt/devtools', // https://github.com/nuxt-modules/icon
		'@nuxt/image', // https://nuxtseo.com/sitemap/getting-started/how-it-works
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
		'nuxt-icon',
		'@nuxt/eslint',
		'@nuxt/ui',
		'@vueuse/nuxt',
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
