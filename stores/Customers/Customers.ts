import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { Customer } from '~/utils/types/customer';
import { failedNotification } from '../AppUi/AppUi';

export const useCustomerStore = defineStore('customerStore', {
	state: () => ({
		loading: false as boolean,
		customers: [] as Customer[],
		total_customers: 0 as number,
		page_size: options_page_size[0],
		current_page: 1,
		errors: [] as string[],
	}),
	actions: {
		async updatePageSize(size: number) {
			this.page_size = size;

			if (this.page_size > this.customers.length) {
				this.current_page = 1;
				return;
			}

			this.getCustomers();
		},

		async updatePage(page: number) {
			this.current_page = page;

			if (this.current_page < 0 || this.customers.length === this.total_customers) {
				return;
			}

			this.getCustomers();
		},

		async getCustomers() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data, '@odata.count': total } = await $api.customer.getMany({
					$top: this.page_size,
					$count: true,
					$skip: (this.current_page - 1) * this.page_size,
				});

				if (data) {
					if (this.current_page > 1 && this.total_customers > this.customers.length) {
						this.customers = [...this.customers, ...data];
					} else {
						this.customers = data;
					}

					this.total_customers = total ?? 0;
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
