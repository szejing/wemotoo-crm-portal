import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { Customer } from '~/utils/types/customer';
import { failedNotification } from '../AppUi/AppUi';

export const useCustomerStore = defineStore('customerStore', {
	state: () => ({
		loading: false as boolean,
		customers: [] as Customer[],
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		updatePageSize(size: number) {
			this.pageSize = size;
		},
		async getCustomers() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.customer.getMany();

				if (data.customers) {
					this.customers = data.customers;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},
	},
});
