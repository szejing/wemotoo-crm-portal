import type { PaymentTypeGroup } from '~/utils/types/payment-type';
import { failedNotification } from '../AppUi/AppUi';
import { options_page_size } from '~/utils/options';

export const usePaymentTypeStore = defineStore('paymentTypeStore', {
	state: () => ({
		paymentTypeGroups: [] as PaymentTypeGroup[],
		pageSize: options_page_size[0],
		loading: false as boolean,
	}),

	actions: {
		updatePageSize(size: number) {
			this.pageSize = size;
		},
		async getPaymentTypeGroups() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.paymentType.fetchMany();

				if (data.groups) {
					this.paymentTypeGroups = data.groups;
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
