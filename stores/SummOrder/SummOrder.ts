import type { SummDaily, SummCustomer, SummOrderBill } from '~/utils/types/summ-orders';
import { failedNotification } from '../AppUi/AppUi';
import type { FilterType, OrderStatus } from 'wemotoo-common';
import { extractDate } from 'wemotoo-common';

export type OrderSumm = {
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
		status: 'completed',
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
		order_summ: initialEmptyOrderSumm,
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
					start_date: extractDate(start_date!),
					end_date: extractDate(end_date!),
				});

				if (data.daily_summaries) {
					this.daily_summaries = data.daily_summaries;
				}

				if (data.top_purchased_customers) {
					this.top_purchased_customers = data.top_purchased_customers;
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
					order_status: this.order_summ.filter.status as OrderStatus,
					start_date: extractDate(this.order_summ.filter.start_date),
					end_date: this.order_summ.filter.end_date ? extractDate(this.order_summ.filter.end_date) : undefined,
					currency_code: 'MYR',
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
	},
});
