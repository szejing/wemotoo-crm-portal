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
	ProductVariantModule,
	PaymentTypeGroupModule,
	PaymentMethodModule,
	CountryModule,
	SaleSummaryModule,
	SaleModule,
	CustomerModule,
} from '~/repository/modules';

interface IApiInstance {
	product: ProductModule;
	tag: ProductTagModule;
	category: ProductCategoryModule;
	productOption: ProductOptionModule;
	auth: AuthModule;
	currency: CurrencyModule;
	image: ImageModule;
	setting: SettingModule;
	productType: ProductTypeModule;
	summOrder: SummOrderModule;
	summSales: SaleSummaryModule;
	order: OrderModule;
	productVariant: ProductVariantModule;
	paymentTypeGroup: PaymentTypeGroupModule;
	paymentMethod: PaymentMethodModule;
	country: CountryModule;
	sale: SaleModule;
	customer: CustomerModule;
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
	const productModule = new ProductModule(apiFetcher);
	const tagModule = new ProductTagModule(apiFetcher);
	const categoryModule = new ProductCategoryModule(apiFetcher);
	const productOptionModule = new ProductOptionModule(apiFetcher);
	const imageModule = new ImageModule(apiFetcher);
	const settingModule = new SettingModule(apiFetcher);
	const productTypeModule = new ProductTypeModule(apiFetcher);
	const summOrderModule = new SummOrderModule(apiFetcher);
	const summSalesModule = new SaleSummaryModule(apiFetcher);
	const orderModule = new OrderModule(apiFetcher);
	const productVariantModule = new ProductVariantModule(apiFetcher);
	const paymentTypeGroupModule = new PaymentTypeGroupModule(apiFetcher);
	const paymentMethodModule = new PaymentMethodModule(apiFetcher);
	const countryModule = new CountryModule(apiFetcher);
	const saleModule = new SaleModule(apiFetcher);
	const customerModule = new CustomerModule(apiFetcher);

	const modules: IApiInstance = {
		auth: authModule,
		currency: currencyModule,
		product: productModule,
		tag: tagModule,
		category: categoryModule,
		productOption: productOptionModule,
		image: imageModule,
		setting: settingModule,
		productType: productTypeModule,
		summOrder: summOrderModule,
		summSales: summSalesModule,
		order: orderModule,
		productVariant: productVariantModule,
		paymentTypeGroup: paymentTypeGroupModule,
		paymentMethod: paymentMethodModule,
		country: countryModule,
		sale: saleModule,
		customer: customerModule,
	};

	return {
		provide: {
			api: modules,
		},
	};
});
