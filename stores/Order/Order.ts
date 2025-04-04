import { defineStore } from 'pinia';
import { OrderStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { Order } from '~/utils/types/order';
import { failedNotification } from '../AppUi/AppUi';

export const useOrderStore = defineStore('orderStore', {
	state: () => ({
		loading: false as boolean,
		orders: [] as Order[],
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		async getOrders(start_date?: string, end_date?: string) {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const response = await $api.order.getOrders({
					limit: this.pageSize,
					offset: 0,
					status: OrderStatus.PENDING_PAYMENT,
					date_from: start_date,
					date_to: end_date,
				});
				console.log(response);
				// this.orders = response.data;
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},
	},
});
