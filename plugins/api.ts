import AuthModule from '~/repository/modules/auth';
import ProductTagsModule from '~/repository/modules/product-tags';

interface IApiInstance {
	productTag: ProductTagsModule;
	auth: AuthModule;
}

export default defineNuxtPlugin((_) => {
	const config = useRuntimeConfig();
	const NUXT_BASE_URL_PROXY_SERVER: string = config.public.apiBaseUrl;

	const apiFetcher = $fetch.create({
		baseURL: NUXT_BASE_URL_PROXY_SERVER,
		// onRequest({ request, response }) {
		// 	console.log('Request:', request);
		// 	console.log('Response:', response);
		// },
	});

	const productTagModule = new ProductTagsModule(apiFetcher);
	const authModule = new AuthModule(apiFetcher);

	const modules: IApiInstance = {
		productTag: productTagModule,
		auth: authModule,
	};
	/*
	 * ! This code below is example for the case you want to authenticate user and set token to headers.
	 * Why call api in process.client?
	 * => Cookie only exist on client.
	 *  */
	if (import.meta.client) {
		// modules.auth
		// 	.login(email, password)
		// 	.then((data) => {
		// 		if (data.accessToken) {
		// 			productTagModule.setAccessToken(data.accessToken);
		// 		}
		// 	})
		// 	.catch((err: any) => {
		// 		console.error('Error occur:' + err);
		// 	});
	}

	return {
		provide: {
			api: modules,
		},
	};
});
