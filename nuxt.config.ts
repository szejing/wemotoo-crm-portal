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
		'@samk-dev/nuxt-vcalendar',
	],

	devtools: { enabled: true },

	app: {
		head: {
			link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }],
		},
		baseURL: process.env.NODE_ENV === 'production' ? '/' : '/',
	},

	css: ['~/assets/css/tailwind.css'],

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

	build: {
		extractCSS: true,
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

	experimental: {
		inlineSSRStyles: false,
	},

	compatibilityDate: '2024-04-03',

	nitro: {
		compressPublicAssets: true,
	},

	vite: {
		css: {
			preprocessorOptions: {
				css: {
					charset: false,
				},
			},
		},
		server: {
			fs: {
				allow: [
					'.', // project root
					'..', // parent directory for potential shared modules
				],
			},
		},
	},

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
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
