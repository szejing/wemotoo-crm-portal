import { failedNotification } from '../AppUi/AppUi';

export const useSummOrderStore = defineStore('summOrderStore', {
	state: () => ({
		loading: false as boolean,
		errors: [] as string[],
	}),
	actions: {
		async getDashboardSummary(start_date: string, end_date: string) {
			this.loading = true;
			const { $api } = useNuxtApp();

			try {
				await $api.summOrder
					.getDashboardOrderSummary({
						start_date,
						end_date,
					})
					.then((data) => {
						console.log(data);
					});
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},
	},
});
