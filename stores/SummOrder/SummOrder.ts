import type { SummDaily, SummCustomer } from '~/utils/types/summ-orders';
import { failedNotification } from '../AppUi/AppUi';
import { extractDate } from 'wemotoo-common';

export const useSummOrderStore = defineStore('summOrderStore', {
	state: () => ({
		loading: false as boolean,
		errors: [] as string[],
		daily_summaries: [] as SummDaily[],
		top_purchased_customers: [] as SummCustomer[],
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
	},
});
