import { defineStore } from 'pinia';
import { useCategoriesStore, useMaintenanceServiceStore, useTagsStore } from '.';

export const useAppStore = defineStore({
	id: 'appStore',
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

			const maintenanceServiceStore = useMaintenanceServiceStore();
			await maintenanceServiceStore.getMaintenanceServices();

			const merchantInfo = useMerchantInfoStore();
			await merchantInfo.getCurrencies();

			const settingsStore = useSettingsStore();
			await settingsStore.getSettings();
		},
	},
});
