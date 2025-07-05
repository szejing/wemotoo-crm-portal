import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { Customer } from '~/utils/types/customer';
import { failedNotification } from '../AppUi/AppUi';

export const useCustomerStore = defineStore('customerStore', {
	state: () => ({
		loading: false as boolean,
		customers: [] as Customer[],
		page_size: options_page_size[0],
		current_page: 1,
		errors: [] as string[],
	}),
	actions: {
		updatePageSize(size: number) {
			this.page_size = size;
		},
		async getCustomers() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data } = await $api.customer.getMany({
					$top: this.page_size,
					$skip: (this.current_page - 1) * this.page_size,
				});

				if (data) {
					this.customers = data;
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
