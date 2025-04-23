import {
	AuthModule,
	CategoryModule,
	CurrencyModule,
	ImageModule,
	ProductModule,
	ProductOptionModule,
	ProductTypeModule,
	SettingModule,
	TagModule,
	OrderModule,
	SummOrderModule,
	DataModule,
} from '~/repository/modules';

interface IApiInstance {
	product: ProductModule;
	tag: TagModule;
	category: CategoryModule;
	productOption: ProductOptionModule;
	auth: AuthModule;
	currency: CurrencyModule;
	data: DataModule;
	image: ImageModule;
	setting: SettingModule;
	productType: ProductTypeModule;
	summOrder: SummOrderModule;
	order: OrderModule;
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
	const dataModule = new DataModule(apiFetcher);
	const currencyModule = new CurrencyModule(apiFetcher);
	const productModule = new ProductModule(apiFetcher);
	const tagModule = new TagModule(apiFetcher);
	const categoryModule = new CategoryModule(apiFetcher);
	const productOptionModule = new ProductOptionModule(apiFetcher);
	const imageModule = new ImageModule(apiFetcher);
	const settingModule = new SettingModule(apiFetcher);
	const productTypeModule = new ProductTypeModule(apiFetcher);
	const summOrderModule = new SummOrderModule(apiFetcher);
	const orderModule = new OrderModule(apiFetcher);

	const modules: IApiInstance = {
		auth: authModule,
		data: dataModule,
		currency: currencyModule,
		product: productModule,
		tag: tagModule,
		category: categoryModule,
		productOption: productOptionModule,
		image: imageModule,
		setting: settingModule,
		productType: productTypeModule,
		summOrder: summOrderModule,
		order: orderModule,
	};

	return {
		provide: {
			api: modules,
		},
	};
});
