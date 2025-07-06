import { defineStore } from 'pinia';
import { PaymentStatus, getFormattedDate, isEmptyOrNull, SaleStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import { failedNotification } from '../AppUi/AppUi';
import type { Bill } from '~/repository/modules/sale/models/response/bill';

type SaleFilter = {
	query: string;
	status: SaleStatus;
	payment_status: PaymentStatus;
	filter_type: 'between' | '=';
	start_date: Date;
	end_date: Date | undefined;
	page_size: number;
	current_page: number;
	currency_code: string;
};

const initialEmptySaleFilter: SaleFilter = {
	query: '',
	status: SaleStatus.COMPLETED,
	payment_status: PaymentStatus.SUCCESS,
	filter_type: '=',
	start_date: new Date(),
	end_date: undefined,
	page_size: options_page_size[0],
	current_page: 1,
	currency_code: 'MYR',
};

export const useSaleStore = defineStore('saleStore', {
	state: () => ({
		loading: false as boolean,
		bills: [] as Bill[],
		detail: undefined as Bill | undefined,
		errors: [] as string[],
		filter: initialEmptySaleFilter,
	}),
	actions: {
		async getBills() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				let filter = `status eq '${this.filter.status}' and payment_status eq '${this.filter.payment_status}'`;
				if (this.filter.end_date) {
					filter += ` and created_at ge ${getFormattedDate(this.filter.start_date, 'yyyy-MM-dd')} and created_at le ${getFormattedDate(
						this.filter.end_date,
						'yyyy-MM-dd',
					)}`;
				} else {
					filter += ` and created_at eq ${getFormattedDate(this.filter.start_date, 'yyyy-MM-dd')}`;
				}

				const { data } = await $api.sale.getBills({
					$top: this.filter.page_size,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$filter: filter,
					$search: isEmptyOrNull(this.filter.query) ? undefined : this.filter.query,
				});

				if (data) {
					this.bills = data;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			} finally {
				this.loading = false;
			}
		},

		async getBillDetailsByBillNo(bill_no: string) {
			const { $api } = useNuxtApp();
			try {
				const data = await $api.sale.getBillDetailsByBillNo(bill_no);

				if (data.bill) {
					this.detail = data.bill;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			}
		},
	},
});
