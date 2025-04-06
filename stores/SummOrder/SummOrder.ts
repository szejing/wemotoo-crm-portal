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
		async getDashboardSummary(start_date: Date, end_date: Date) {
			this.loading = true;
			const { $api } = useNuxtApp();

			try {
				const data = await $api.summOrder.getDashboardOrderSummary({
					start_date: extractDate(start_date),
					end_date: extractDate(end_date),
				});

				if (data.daily_summaries) {
					this.daily_summaries = data.daily_summaries;
				}

				if (data.top_purchased_customers) {
					this.top_purchased_customers = data.top_purchased_customers;
				}

				console.log(this.daily_summaries);
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},
	},
});
