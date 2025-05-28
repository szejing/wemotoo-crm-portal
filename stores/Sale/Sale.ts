import { defineStore } from 'pinia';
import { PaymentStatus, type FilterType } from 'wemotoo-common';
import { getFormattedDate, isEmptyOrNull, SaleStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import { failedNotification } from '../AppUi/AppUi';
import type { Sale } from '~/repository/modules/sale/models/response/sale';

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
		transactions: [] as Sale[],
		detail: undefined as Sale | undefined,
		errors: [] as string[],
		filter: initialEmptySaleFilter,
	}),
	actions: {
		async getTransactions() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.sale.getSales({
					limit: this.filter.page_size,
					offset: 0,
					filter_type: this.filter.filter_type as FilterType,
					start_date: getFormattedDate(this.filter.start_date),
					end_date: this.filter.end_date ? getFormattedDate(this.filter.end_date) : undefined,
					status: this.filter.status,
					q: isEmptyOrNull(this.filter.query) ? undefined : this.filter.query,
				});

				if (data) {
					this.transactions = data.sales;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			} finally {
				this.loading = false;
			}
		},

		async getTransactionByBillNo(bill_no: string) {
			const { $api } = useNuxtApp();
			// try {
			// 	const data = await $api.sale.getSaleBySaleNo(sale_no);

			// 	if (data.sale) {
			// 		this.detail = data.sale;
			// 	}
			// } catch (err: any) {
			// 	console.error(err);
			// 	failedNotification(err.message);
			// 	throw err;
			// }
		},
	},
});
