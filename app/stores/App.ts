import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
	state: () => ({}),
	actions: {
		async init() {
			const productOptionsStore = useProductOptionStore();
			const productTagsStore = useProductTagStore();
			const categoryStore = useProductCategoryStore();
			const brandStore = useBrandStore();
			// const productStore = useProductStore();
			const merchantInfo = useMerchantInfoStore();
			const settingsStore = useSettingStore();
			const productTypeStore = useProductTypeStore();
			const orderStore = useOrderStore();
			const paymentTypeStore = usePaymentTypeStore();
			const paymentMethodStore = usePaymentMethodStore();
			const summOrderStore = useSummOrderStore();
			const summSalesStore = useSummSaleStore();
			const customerStore = useCustomerStore();

			// const outletStore = useOutletStore();
			// const taxStore = useTaxStore();
			// const taxGroupStore = useTaxGroupStore();
			// const taxRuleStore = useTaxRuleStore();
			await merchantInfo.getMerchantInfos();

			await Promise.all([
				productOptionsStore.getOptions(),
				productTagsStore.getTags(),
				categoryStore.getCategories(),
				brandStore.getBrands(),
				merchantInfo.getCurrencies(),
				settingsStore.getSettings(),
				productTypeStore.getProductTypes(),
				orderStore.getOrders(),
				paymentTypeStore.getPaymentTypeGroups(),
				paymentMethodStore.getPaymentMethods(),
				summOrderStore.getDashboardSummary(),
				summSalesStore.getDashboardSummary(),
				// customerStore.getCustomers(),
				// productStore.getProducts(),
				// outletStore.getOutlets(),
				// taxStore.getTaxes(),
				// taxGroupStore.getTaxGroups(),
				// taxRuleStore.getTaxRules(),
			]);
		},
	},
});
