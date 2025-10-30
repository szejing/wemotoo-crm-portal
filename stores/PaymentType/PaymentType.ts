import type { PaymentTypeGroup } from '~/utils/types/payment-type';
import { failedNotification } from '../AppUi/AppUi';
import { options_page_size } from '~/utils/options';
import { defaultPaymentTypeGroupRelations } from 'wemotoo-common';

export const usePaymentTypeStore = defineStore('paymentTypeStore', {
	state: () => ({
		payment_type_groups: [] as PaymentTypeGroup[],
		total_payment_type_groups: 0 as number,
		page_size: options_page_size[0] as number,
		current_page: 1,
		loading: false as boolean,
	}),

	actions: {
		async updatePageSize(size: number) {
			this.page_size = size;

			if (this.page_size > this.payment_type_groups.length) {
				this.current_page = 1;
				return;
			}

			this.getPaymentTypeGroups();
		},

		async updatePage(page: number) {
			this.current_page = page;

			if (this.current_page < 0 || this.payment_type_groups.length === this.total_payment_type_groups) {
				return;
			}

			this.getPaymentTypeGroups();
		},

		async getPaymentTypeGroups() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data, '@odata.count': total } = await $api.paymentTypeGroup.getMany({
					$top: this.page_size,
					$count: true,
					$skip: (this.current_page - 1) * this.page_size,
					$expand: filterRelations(defaultPaymentTypeGroupRelations).join(','),
				});

				if (data) {
					if (this.current_page > 1 && this.total_payment_type_groups > this.payment_type_groups.length) {
						this.payment_type_groups = [...this.payment_type_groups, ...data];
					} else {
						this.payment_type_groups = data;
					}

					this.total_payment_type_groups = total ?? 0;
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
