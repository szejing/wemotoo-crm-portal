import { defineStore } from 'pinia';
import { useMaintenanceServiceStore } from './MaintenanceService/MaintenanceService';

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

			const productStore = useProductStore();
			await productStore.getProducts();

			const maintenanceServiceStore = useMaintenanceServiceStore();
			await maintenanceServiceStore.getMaintenanceServices();

			const merchantInfo = useMerchantInfoStore();
			await merchantInfo.getCurrencies();
		},
	},
});
