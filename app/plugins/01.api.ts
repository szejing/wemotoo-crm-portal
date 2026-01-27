import {
	AuthModule,
	ProductCategoryModule,
	ProductTagModule,
	CurrencyModule,
	CrmUserModule,
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
	ProductBrandModule,
	AppointmentModule,
	OutletModule,
	TaxGroupModule,
	TaxModule,
	TaxRuleModule,
} from '../repository/modules';

interface IApiInstance {
	product: ProductModule;
	tag: ProductTagModule;
	category: ProductCategoryModule;
	productOption: ProductOptionModule;
	auth: AuthModule;
	currency: CurrencyModule;
	crmUser: CrmUserModule;
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
	brand: ProductBrandModule;
	appointment: AppointmentModule;
	taxRule: TaxRuleModule;
	tax: TaxModule;
	taxGroup: TaxGroupModule;
	outlet: OutletModule;
}

export default defineNuxtPlugin((_) => {
	// const config = useRuntimeConfig();
	// const NUXT_BASE_URL_PROXY_SERVER: string = config.public.apiBaseUrl;

	// const apiFetcher = $fetch.create({
	// baseURL: NUXT_BASE_URL_PROXY_SERVER,
	// onRequest({ request, response }) {
	// 	console.log('Request:', request);
	// 	console.log('Response:', response);
	// },
	// });

	const authModule = new AuthModule();
	const currencyModule = new CurrencyModule();
	const productModule = new ProductModule();
	const tagModule = new ProductTagModule();
	const categoryModule = new ProductCategoryModule();
	const productOptionModule = new ProductOptionModule();
	const imageModule = new ImageModule();
	const settingModule = new SettingModule();
	const productTypeModule = new ProductTypeModule();
	const summOrderModule = new SummOrderModule();
	const summSalesModule = new SaleSummaryModule();
	const orderModule = new OrderModule();
	const productVariantModule = new ProductVariantModule();
	const paymentTypeGroupModule = new PaymentTypeGroupModule();
	const paymentMethodModule = new PaymentMethodModule();
	const countryModule = new CountryModule();
	const crmUserModule = new CrmUserModule();
	const saleModule = new SaleModule();
	const customerModule = new CustomerModule();
	const brandModule = new ProductBrandModule();
	const appointmentModule = new AppointmentModule();
	const taxRuleModule = new TaxRuleModule();
	const taxModule = new TaxModule();
	const taxGroupModule = new TaxGroupModule();
	const outletModule = new OutletModule();

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
		crmUser: crmUserModule,
		sale: saleModule,
		customer: customerModule,
		brand: brandModule,
		appointment: appointmentModule,
		taxRule: taxRuleModule,
		tax: taxModule,
		taxGroup: taxGroupModule,
		outlet: outletModule,
	};

	return {
		provide: {
			api: modules,
		},
	};
});
