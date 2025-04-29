import {
	AuthModule,
	ProductCategoryModule,
	ProductTagModule,
	CurrencyModule,
	ImageModule,
	ProductModule,
	ProductOptionModule,
	ProductTypeModule,
	SettingModule,
	OrderModule,
	SummOrderModule,
	DataModule,
	ProductVariantModule,
	PaymentTypeModule,
} from '~/repository/modules';

interface IApiInstance {
	product: ProductModule;
	tag: ProductTagModule;
	category: ProductCategoryModule;
	productOption: ProductOptionModule;
	auth: AuthModule;
	currency: CurrencyModule;
	data: DataModule;
	image: ImageModule;
	setting: SettingModule;
	productType: ProductTypeModule;
	summOrder: SummOrderModule;
	order: OrderModule;
	productVariant: ProductVariantModule;
	paymentType: PaymentTypeModule;
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
	const tagModule = new ProductTagModule(apiFetcher);
	const categoryModule = new ProductCategoryModule(apiFetcher);
	const productOptionModule = new ProductOptionModule(apiFetcher);
	const imageModule = new ImageModule(apiFetcher);
	const settingModule = new SettingModule(apiFetcher);
	const productTypeModule = new ProductTypeModule(apiFetcher);
	const summOrderModule = new SummOrderModule(apiFetcher);
	const orderModule = new OrderModule(apiFetcher);
	const productVariantModule = new ProductVariantModule(apiFetcher);
	const paymentTypeModule = new PaymentTypeModule(apiFetcher);

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
		productVariant: productVariantModule,
		paymentType: paymentTypeModule,
	};

	return {
		provide: {
			api: modules,
		},
	};
});
