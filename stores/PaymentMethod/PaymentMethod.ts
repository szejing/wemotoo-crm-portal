import type { PaymentMethod } from '~/utils/types/payment-method';
import { failedNotification } from '../AppUi/AppUi';
import { options_page_size } from '~/utils/options';

export const usePaymentMethodStore = defineStore('paymentMethodStore', {
	state: () => ({
		paymentMethods: [] as PaymentMethod[],
		pageSize: options_page_size[0],
		loading: false as boolean,
	}),

	actions: {
		updatePageSize(size: number) {
			this.pageSize = size;
		},

		async getPaymentMethods() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.paymentMethod.fetchMany();

				if (data.methods) {
					this.paymentMethods = data.methods;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async updateStatus(code: string, is_active: boolean) {
			const { $api } = useNuxtApp();
			try {
				await $api.paymentMethod.updateStatus(code, is_active);

				await this.getPaymentMethods();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			}
		},
	},
});
