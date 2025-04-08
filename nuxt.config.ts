// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		// https://devtools.nuxtjs.org/
		// https://motion.vueuse.org/nuxt.html
		// https://vueuse.org/

		// https://github.com/nuxt-modules/icon
		// https://nuxtseo.com/sitemap/getting-started/how-it-works
		'@pinia/nuxt',
		'@nuxt/devtools',
		'@nuxt/image',
		'@vueuse/motion/nuxt',
		'@vueuse/nuxt',
		'@nuxt/eslint',
		'@nuxt/ui',
		'@vueuse/nuxt',
		'six-dropzone',
		[
			'@nuxtjs/google-fonts',
			{
				families: {
					Lato: {
						wght: '300..900',
						italic: '300..900',
					},
				},
				preload: true,
			},
		],
	],

	devtools: { enabled: true },

	app: {
		head: {
			script: [
				{ src: 'https://unpkg.com/vue@next', async: true },
				{ src: 'https://unpkg.com/@vueup/vue-quill@1.2.0', async: true },
			],
			link: [
				{ rel: 'stylesheet', href: 'https://unpkg.com/@vueup/vue-quill@1.2.0/dist/vue-quill.snow.prod.cs' },
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
			],
		},
	},

	css: ['~/assets/css/main.css', '~/assets/css/tailwind.css'],

	colorMode: {
		preference: 'light',
	},

	// routeRules: {
	// 	'/**': {
	// 		proxy: { to: 'http://127.0.0.1:8888/**' },
	// 	},
	// },
	// nitro: {
	// 	devProxy: {
	// 		'/api': {
	// 			target: 'http://localhost:8888',
	// 			headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' },
	// 			prependPath: true,
	// 			changeOrigin: true,
	// 		},
	// 	},
	// },

	runtimeConfig: {
		version: process.env.APP_VERSION,
		public: {
			baseUrl: process.env.BASE_URL,
			apiKey: process.env.API_KEY,
			jwtSecret: process.env.JWT_SECRET,
		},
	},

	routeRules: {
		'/api**': {
			// enable CORS
			cors: true, // if enabled, also needs cors-preflight-request.ts Nitro middleware to answer CORS preflight requests
			headers: {
				// CORS headers
				'Access-Control-Allow-Origin': '*', // 'http://example:6006', has to be set to the requesting domain that you want to send the credentials back to
				'Access-Control-Allow-Methods': '*', // 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
				'Access-Control-Allow-Credentials': 'true',
				'Access-Control-Allow-Headers': '*', // 'Origin, Content-Type, Accept, Authorization, X-Requested-With'
				'Access-Control-Expose-Headers': '*',
				// 'Access-Control-Max-Age': '7200', // 7200 = caching 2 hours (Chromium default), https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age#directives
			},
		},
	},

	compatibilityDate: '2024-04-03',
	// For TypeScript support
	typescript: {
		tsConfig: {
			compilerOptions: {
				paths: {
					'wemotoo-common': ['../wemotoo-common/dist'],
				},
			},
		},
	},

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
