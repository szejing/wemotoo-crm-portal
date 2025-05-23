import type { SummDaily, SummCustomer, SummOrderBill, SummOrderItem, SummProduct } from '~/utils/types/summ-orders';
import { failedNotification } from '../AppUi/AppUi';
import { OrderStatus, type FilterType } from 'wemotoo-common';
import { getFormattedDate, OrderItemStatus } from 'wemotoo-common';

type OrderSumm = {
	filter: {
		start_date: Date;
		end_date: Date | undefined;
		filter_type: string;
		status: string;
		currency_code: string;
	};
	is_loading: boolean;
	data: SummOrderBill[];
};

const initialEmptyOrderSumm: OrderSumm = {
	filter: {
		start_date: new Date(),
		end_date: undefined,
		filter_type: '=',
		status: OrderStatus.NEW,
		currency_code: 'MYR',
	},
	is_loading: false,
	data: [],
};

type OrderSummItem = {
	filter: {
		start_date: Date;
		end_date: Date | undefined;
		filter_type: string;
		status: string;
		item_status: string;
		currency_code: string;
	};
	is_loading: boolean;
	data: SummOrderItem[];
};

const initialEmptyOrderSummItem: OrderSummItem = {
	filter: {
		start_date: new Date(),
		end_date: undefined,
		filter_type: '=',
		status: OrderStatus.NEW,
		item_status: OrderItemStatus.ACTIVE,
		currency_code: 'MYR',
	},
	is_loading: false,
	data: [],
};

export const useSummOrderStore = defineStore('summOrderStore', {
	state: () => ({
		loading: false as boolean,
		errors: [] as string[],
		daily_summaries: [] as SummDaily[],
		top_purchased_customers: [] as SummCustomer[],
		top_purchased_products: [] as SummProduct[],
		order_summ: initialEmptyOrderSumm,
		order_summ_item: initialEmptyOrderSummItem,
	}),
	actions: {
		async getDashboardSummary(start_date?: Date, end_date?: Date) {
			this.loading = true;
			const { $api } = useNuxtApp();

			if (end_date == undefined) {
				end_date = new Date();
				end_date.setHours(0, 0, 0, 0);
			}

			if (start_date == undefined) {
				start_date = new Date(end_date);
				start_date.setDate(start_date.getDate() - 7);
			}

			try {
				const data = await $api.summOrder.getDashboardOrderSummary({
					start_date: getFormattedDate(start_date!),
					end_date: getFormattedDate(end_date!),
				});

				if (data.daily_summaries) {
					this.daily_summaries = data.daily_summaries;
				}

				if (data.top_purchased_customers) {
					this.top_purchased_customers = data.top_purchased_customers;
				}

				if (data.top_purchased_products) {
					this.top_purchased_products = data.top_purchased_products;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async getOrderSummary() {
			this.order_summ.is_loading = true;
			const { $api } = useNuxtApp();

			try {
				const data = await $api.summOrder.getSummOrders({
					filter_type: this.order_summ.filter.filter_type as FilterType,
					status: this.order_summ.filter.status as OrderStatus,
					start_date: getFormattedDate(this.order_summ.filter.start_date),
					end_date: this.order_summ.filter.end_date ? getFormattedDate(this.order_summ.filter.end_date) : undefined,
					currency_code: this.order_summ.filter.currency_code,
				});

				if (data.summ_orders) {
					this.order_summ.data = data.summ_orders;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.order_summ.is_loading = false;
			}
		},

		async getOrderItemSummary() {
			this.order_summ_item.is_loading = true;
			const { $api } = useNuxtApp();

			try {
				const data = await $api.summOrder.getSummOrderItems({
					filter_type: this.order_summ_item.filter.filter_type as FilterType,
					status: this.order_summ_item.filter.status as OrderStatus,
					item_status: this.order_summ_item.filter.item_status as OrderItemStatus,
					start_date: getFormattedDate(this.order_summ_item.filter.start_date),
					end_date: this.order_summ_item.filter.end_date ? getFormattedDate(this.order_summ_item.filter.end_date) : undefined,
					currency_code: this.order_summ_item.filter.currency_code,
				});
				if (data.summ_order_items) {
					this.order_summ_item.data = data.summ_order_items;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.order_summ_item.is_loading = false;
			}
		},
	},
});
