import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
	state: () => ({}),
	actions: {
		async init() {
			const productOptionsStore = useProductOptionsStore();
			await productOptionsStore.getOptions();

			const productTagsStore = useTagsStore();
			await productTagsStore.getTags();

			const categoryStore = useCategoriesStore();
			await categoryStore.getCategories();

			const productStore = useProductStore();
			await productStore.getProducts();

			const merchantInfo = useMerchantInfoStore();
			await merchantInfo.getCurrencies();

			const settingsStore = useSettingsStore();
			await settingsStore.getSettings();

			const productTypeStore = useProductTypesStore();
			await productTypeStore.getProductTypes();

			const orderStore = useOrderStore();
			await orderStore.getOrders();

			const summOrderStore = useSummOrderStore();
			await summOrderStore.getDashboardSummary();
		},
	},
});
