import type { SummDaily, SummCustomer } from '~/utils/types/summ-orders';
import { failedNotification } from '../AppUi/AppUi';

export const useSummOrderStore = defineStore('summOrderStore', {
	state: () => ({
		loading: false as boolean,
		errors: [] as string[],
		daily_summaries: [] as SummDaily[],
		top_purchased_customers: [] as SummCustomer[],
	}),
	actions: {
		async getDashboardSummary(start_date: string, end_date: string) {
			this.loading = true;
			const { $api } = useNuxtApp();

			try {
				const data = await $api.summOrder.getDashboardOrderSummary({
					start_date,
					end_date,
				});

				this.daily_summaries = data.daily_summaries;
				this.top_purchased_customers = data.top_purchased_customers;

				console.log(data);
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},
	},
});
