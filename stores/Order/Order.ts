import { defineStore } from 'pinia';
import type { FilterType } from 'wemotoo-common';
import { getFormattedDate, isEmptyOrNull, OrderStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { Order } from '~/utils/types/order';
import { failedNotification } from '../AppUi/AppUi';

type OrderFilter = {
	query: string;
	status: OrderStatus;
	filter_type: 'between' | '=';
	start_date: Date;
	end_date: Date | undefined;
	page_size: number;
	currency_code: string;
};

const initialEmptyOrderFilter: OrderFilter = {
	query: '',
	status: OrderStatus.PENDING_PAYMENT,
	filter_type: '=',
	start_date: new Date(),
	end_date: undefined,
	page_size: options_page_size[0],
	currency_code: 'MYR',
};

export const useOrderStore = defineStore('orderStore', {
	state: () => ({
		loading: false as boolean,
		orders: [] as Order[],
		errors: [] as string[],
		filter: initialEmptyOrderFilter,
	}),
	actions: {
		async getOrders() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.order.getOrders({
					limit: this.filter.page_size,
					offset: 0,
					filter_type: this.filter.filter_type as FilterType,
					start_date: getFormattedDate(this.filter.start_date),
					end_date: this.filter.end_date ? getFormattedDate(this.filter.end_date) : undefined,
					order_status: this.filter.status,
					q: isEmptyOrNull(this.filter.query) ? undefined : this.filter.query,
				});

				if (data) {
					this.orders = data.orders;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			} finally {
				this.loading = false;
			}
		},

		async getOrderByOrderNo(order_no: string): Promise<Order> {
			const { $api } = useNuxtApp();
			try {
				const data = await $api.order.getOrderByOrderNo(order_no);

				return data.order;
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			}
		},
	},
});
