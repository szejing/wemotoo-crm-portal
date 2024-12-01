import AuthModule from '~/repository/modules/auth';
import CountryModule from '~/repository/modules/country';
import CurrencyModule from '~/repository/modules/currency';
import ProductModule from '~/repository/modules/product';
import ProductCategoryModule from '~/repository/modules/product-category';
import ProductOptionModule from '~/repository/modules/product-option';
import ProductTagModule from '~/repository/modules/product-tag';

interface IApiInstance {
	product: ProductModule;
	productTag: ProductTagModule;
	productCategory: ProductCategoryModule;
	productOption: ProductOptionModule;
	auth: AuthModule;
	currency: CurrencyModule;
	country: CountryModule;
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
	const countryModule = new CountryModule(apiFetcher);
	const currencyModule = new CurrencyModule(apiFetcher);
	const productModule = new ProductModule(apiFetcher);
	const productTagModule = new ProductTagModule(apiFetcher);
	const productCategoryModule = new ProductCategoryModule(apiFetcher);
	const productOptionModule = new ProductOptionModule(apiFetcher);

	const modules: IApiInstance = {
		auth: authModule,
		country: countryModule,
		currency: currencyModule,
		product: productModule,
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
