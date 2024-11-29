import { defineStore } from 'pinia';

export const useAppStore = defineStore({
	id: 'appStore',
	state: () => ({}),
	actions: {
		async init() {
			const productOptionsStore = useProductOptionsStore();
			await productOptionsStore.getOptions();

			const productTagsStore = useProductTagsStore();
			await productTagsStore.getTags();

			const categoryStore = useProductCategoriesStore();
			await categoryStore.getCategories();

			const merchantInfo = useMerchantInfoStore();
			await merchantInfo.getCurrencies();
		},
	},
});
