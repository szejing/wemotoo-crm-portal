import AuthModule from '~/repository/modules/auth';
import CountryModule from '~/repository/modules/country';
import CurrencyModule from '~/repository/modules/currency';
import ImageModule from '~/repository/modules/image';
import ProductModule from '~/repository/modules/product';
import CategoryModule from '~/repository/modules/category';
import ProductOptionModule from '~/repository/modules/product-option';
import TagModule from '~/repository/modules/tag';
import SettingModule from '~/repository/modules/setting';

interface IApiInstance {
	product: ProductModule;
	tag: TagModule;
	category: CategoryModule;
	productOption: ProductOptionModule;
	auth: AuthModule;
	currency: CurrencyModule;
	country: CountryModule;
	image: ImageModule;
	setting: SettingModule;
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
	const tagModule = new TagModule(apiFetcher);
	const categoryModule = new CategoryModule(apiFetcher);
	const productOptionModule = new ProductOptionModule(apiFetcher);
	const imageModule = new ImageModule(apiFetcher);
	const settingModule = new SettingModule(apiFetcher);

	const modules: IApiInstance = {
		auth: authModule,
		country: countryModule,
		currency: currencyModule,
		product: productModule,
		tag: tagModule,
		category: categoryModule,
		productOption: productOptionModule,
		image: imageModule,
		setting: settingModule,
	};

	return {
		provide: {
			api: modules,
		},
	};
});
