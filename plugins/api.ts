import AuthModule from '~/repository/modules/auth';
import CurrencyModule from '~/repository/modules/currency';
import ProductCategoryModule from '~/repository/modules/product-category';
import ProductOptionModule from '~/repository/modules/product-option';
import ProductTagModule from '~/repository/modules/product-tag';

interface IApiInstance {
	productTag: ProductTagModule;
	productCategory: ProductCategoryModule;
	productOption: ProductOptionModule;
	auth: AuthModule;
	currency: CurrencyModule;
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
	const currencyModule = new CurrencyModule(apiFetcher);
	const productTagModule = new ProductTagModule(apiFetcher);
	const productCategoryModule = new ProductCategoryModule(apiFetcher);
	const productOptionModule = new ProductOptionModule(apiFetcher);

	const modules: IApiInstance = {
		auth: authModule,
		currency: currencyModule,
		productTag: productTagModule,
		productCategory: productCategoryModule,
		productOption: productOptionModule,
	};

	return {
		provide: {
			api: modules,
		},
	};
});
