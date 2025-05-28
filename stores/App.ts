import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
	state: () => ({}),
	actions: {
		async init() {
			const productOptionsStore = useProductOptionStore();
			const productTagsStore = useProductTagStore();
			const categoryStore = useProductCategoryStore();
			const productStore = useProductStore();
			const merchantInfo = useMerchantInfoStore();
			const settingsStore = useSettingStore();
			const productTypeStore = useProductTypeStore();
			const orderStore = useOrderStore();
			const paymentTypeStore = usePaymentTypeStore();
			const paymentMethodStore = usePaymentMethodStore();
			const summOrderStore = useSummOrderStore();
			const summSalesStore = useSummSaleStore();
			const customerStore = useCustomerStore();

			Promise.all([
				productOptionsStore.getOptions(),
				productTagsStore.getTags(),
				categoryStore.getCategories(),
				productStore.getProducts(),
				merchantInfo.getCurrencies(),
				settingsStore.getSettings(),
				productTypeStore.getProductTypes(),
				orderStore.getOrders(),
				paymentTypeStore.getPaymentTypeGroups(),
				paymentMethodStore.getPaymentMethods(),
				summOrderStore.getDashboardSummary(),
				summSalesStore.getDashboardSummary(),
				customerStore.getCustomers(),
			]);
		},
	},
});
