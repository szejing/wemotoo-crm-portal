import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
	state: () => ({}),
	actions: {
		async init() {
			const productOptionsStore = useProductOptionStore();
			await productOptionsStore.getOptions();

			const productTagsStore = useProductTagStore();
			await productTagsStore.getTags();

			const categoryStore = useProductCategoryStore();
			await categoryStore.getCategories();

			const productStore = useProductStore();
			await productStore.getProducts();

			const merchantInfo = useMerchantInfoStore();
			await merchantInfo.getCurrencies();

			const settingsStore = useSettingStore();
			await settingsStore.getSettings();

			const productTypeStore = useProductTypeStore();
			await productTypeStore.getProductTypes();

			const orderStore = useOrderStore();
			await orderStore.getOrders();

			const paymentTypeStore = usePaymentTypeStore();
			await paymentTypeStore.getPaymentTypeGroups();

			const paymentMethodStore = usePaymentMethodStore();
			await paymentMethodStore.getPaymentMethods();

			const summOrderStore = useSummOrderStore();
			await summOrderStore.getDashboardSummary();

			const summSalesStore = useSummSaleStore();
			await summSalesStore.getDashboardSummary();

			const customerStore = useCustomerStore();
			await customerStore.getCustomers();
		},
	},
});
