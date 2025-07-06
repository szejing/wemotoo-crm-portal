import type { PaymentMethod } from '~/utils/types/payment-method';
import { failedNotification } from '../AppUi/AppUi';
import { options_page_size } from '~/utils/options';
import type { UpdatePaymentMethodReq } from '~/repository/modules/payment-method/models/request/update-payment-method.req';

export const usePaymentMethodStore = defineStore('paymentMethodStore', {
	state: () => ({
		payment_methods: [] as PaymentMethod[],
		total_payment_methods: 0 as number,
		page_size: options_page_size[0],
		current_page: 1,
		loading: false as boolean,
	}),

	actions: {
		async updatePageSize(size: number) {
			this.page_size = size;

			if (this.page_size > this.payment_methods.length) {
				this.current_page = 1;
				return;
			}

			this.getPaymentMethods();
		},

		async updatePage(page: number) {
			this.current_page = page;

			if (this.current_page < 0 || this.payment_methods.length === this.total_payment_methods) {
				return;
			}

			this.getPaymentMethods();
		},

		async getPaymentMethods() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data, '@odata.count': total } = await $api.paymentMethod.getMany({
					$top: this.page_size,
					$count: true,
					$skip: (this.current_page - 1) * this.page_size,
				});

				if (data) {
					if (this.current_page > 1 && this.total_payment_methods > this.payment_methods.length) {
						this.payment_methods = [...this.payment_methods, ...data];
					} else {
						this.payment_methods = data;
					}

					this.total_payment_methods = total ?? 0;
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
