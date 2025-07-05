import type { PaymentTypeGroup } from '~/utils/types/payment-type';
import { failedNotification } from '../AppUi/AppUi';
import { options_page_size } from '~/utils/options';

export const usePaymentTypeStore = defineStore('paymentTypeStore', {
	state: () => ({
		paymentTypeGroups: [] as PaymentTypeGroup[],
		page_size: options_page_size[0],
		current_page: 1,
		loading: false as boolean,
	}),

	actions: {
		updatePageSize(size: number) {
			this.page_size = size;
		},

		async getPaymentTypeGroups() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data } = await $api.paymentTypeGroup.getMany({
					$top: this.page_size,
					$skip: (this.current_page - 1) * this.page_size,
				});

				if (data) {
					this.paymentTypeGroups = data;
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
