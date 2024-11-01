import AuthModule from '~/repository/modules/auth';
import ProductCategoryModule from '~/repository/modules/product-category';
import ProductTagModule from '~/repository/modules/product-tag';

interface IApiInstance {
	productTag: ProductTagModule;
	productCategory: ProductCategoryModule;
	auth: AuthModule;
}

export default defineNuxtPlugin((_) => {
	// const config = useRuntimeConfig();
	// const NUXT_BASE_URL_PROXY_SERVER: string = config.public.apiBaseUrl;

	const apiFetcher = $fetch.create({
		// baseURL: NUXT_BASE_URL_PROXY_SERVER,
		// onRequest({ request, response }) {
		// 	console.log('Request:', request);
		// 	console.log('Response:', response);
		// },
	});

	const authModule = new AuthModule(apiFetcher);
	const productTagModule = new ProductTagModule(apiFetcher);
	const productCategoryModule = new ProductCategoryModule(apiFetcher);

	const modules: IApiInstance = {
		auth: authModule,
		productTag: productTagModule,
		productCategory: productCategoryModule,
	};
	/*
	 * ! This code below is example for the case you want to authenticate user and set token to headers.
	 * Why call api in process.client?
	 * => Cookie only exist on client.
	 *  */
	if (import.meta.client) {
		// const token = useCookie('token', { maxAge: 60 * 60 * 24 * 7 });
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
