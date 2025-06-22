import type { SummDaily, SummCustomer, SummProduct } from '~/utils/types/summ-orders';
import { failedNotification } from '../AppUi/AppUi';
import { initialEmptyOrderSumm } from './model/order-summ.model';
import { initialEmptyOrderSummItem } from './model/order-summ-item.model';
import { FilterType, getFormattedDate, type OrderItemStatus, type OrderStatus } from 'wemotoo-common';
import { initialEmptyOrderSummCustomer } from './model/order-summ-customer.model';

export const useSummOrderStore = defineStore('summOrderStore', {
	state: () => ({
		loading: false as boolean,
		errors: [] as string[],
		daily_summaries: [] as SummDaily[],
		top_purchased_customers: [] as SummCustomer[],
		top_purchased_products: [] as SummProduct[],
		new_orders: 0 as number,
		new_customers: 0 as number,
		total_sales_amt: 0 as number,
		order_summ: initialEmptyOrderSumm,
		order_summ_item: initialEmptyOrderSummItem,
		order_summ_customer: initialEmptyOrderSummCustomer,
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

				if (data.new_orders) {
					this.new_orders = data.new_orders;
				}

				if (data.new_customers) {
					this.new_customers = data.new_customers;
				}

				if (data.total_sales_amt) {
					this.total_sales_amt = data.total_sales_amt;
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
					filter_type: this.order_summ.filter.end_date ? FilterType.BETWEEN : FilterType.EQUAL,
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
					filter_type: this.order_summ_item.filter.end_date ? FilterType.BETWEEN : FilterType.EQUAL,
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

		async getOrderCustomerSummary() {
			this.order_summ_customer.is_loading = true;
			const { $api } = useNuxtApp();

			try {
				const data = await $api.summOrder.getSummOrderCustomers({
					filter_type: this.order_summ_customer.filter.end_date ? FilterType.BETWEEN : FilterType.EQUAL,
					status: this.order_summ_customer.filter.status as OrderStatus,
					start_date: getFormattedDate(this.order_summ_customer.filter.start_date),
					end_date: this.order_summ_customer.filter.end_date ? getFormattedDate(this.order_summ_customer.filter.end_date) : undefined,
					currency_code: this.order_summ_customer.filter.currency_code,
				});
				if (data.summ_order_customers) {
					this.order_summ_customer.data = data.summ_order_customers;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.order_summ_customer.is_loading = false;
			}
		},
	},
});
