import type { PaymentMethod } from '~/utils/types/payment-method';
import { failedNotification } from '../AppUi/AppUi';
import { options_page_size } from '~/utils/options';
import type { UpdatePaymentMethodReq } from '~/repository/modules/payment-method/models/request/update-payment-method.req';

export const usePaymentMethodStore = defineStore('paymentMethodStore', {
	state: () => ({
		paymentMethods: [] as PaymentMethod[],
		page_size: options_page_size[0],
		current_page: 1,
		loading: false as boolean,
	}),

	actions: {
		updatePageSize(size: number) {
			this.page_size = size;
		},

		async getPaymentMethods() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data } = await $api.paymentMethod.getMany({
					$top: this.page_size,
					$skip: (this.current_page - 1) * this.page_size,
				});

				if (data) {
					this.paymentMethods = data;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async updateStatus(request: UpdatePaymentMethodReq) {
			const { $api } = useNuxtApp();
			try {
				await $api.paymentMethod.updateStatus(request);

				await this.getPaymentMethods();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			}
		},
	},
});
