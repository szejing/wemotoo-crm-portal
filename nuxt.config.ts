// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
																																app: {
																																																																head: {
																																																																																																script: ['https://unpkg.com/vue@next', 'https://unpkg.com/@vueup/vue-quill@1.2.0'],
																																																																																																link: [
																																																																																																																																{ rel: 'stylesheet', href: 'https://unpkg.com/@vueup/vue-quill@1.2.0/dist/vue-quill.snow.prod.cs' },
																																																																																																																																{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
																																																																																																],
																																																																},
																																},

																																compatibilityDate: '2024-04-03',

																																devtools: { enabled: true },

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
