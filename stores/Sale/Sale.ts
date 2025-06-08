import { defineStore } from 'pinia';
import { PaymentStatus, type FilterType } from 'wemotoo-common';
import { getFormattedDate, isEmptyOrNull, SaleStatus } from 'wemotoo-common';
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
				const data = await $api.sale.getBills({
					limit: this.filter.page_size,
					offset: 0,
					filter_type: this.filter.filter_type as FilterType,
					start_date: getFormattedDate(this.filter.start_date),
					end_date: this.filter.end_date ? getFormattedDate(this.filter.end_date) : undefined,
					status: this.filter.status,
					q: isEmptyOrNull(this.filter.query) ? undefined : this.filter.query,
				});

				if (data) {
					this.bills = data.bills;
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
