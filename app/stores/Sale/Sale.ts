/* eslint-disable indent */
/* eslint-disable @stylistic/indent */
import { defineStore } from 'pinia';
import type { SaleStatus } from 'wemotoo-common';
import { getFormattedDate } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { Bill } from '~/utils/types/bill';

type SaleFilter = {
	query: string;
	status: SaleStatus | string;
	// payment_status: PaymentStatus;
	start_date: Date;
	end_date: Date | undefined;
	page_size: number;
	current_page: number;
	currency_code: string;
};

const initialEmptySaleFilter: SaleFilter = {
	query: '',
	status: 'All',
	// payment_status: PaymentStatus.SUCCESS,
	start_date: new Date(),
	end_date: undefined,
	page_size: options_page_size[0] as number,
	current_page: 1,
	currency_code: 'MYR',
};

export const useSaleStore = defineStore('saleStore', {
	state: () => ({
		exporting: false as boolean,
		loading: false as boolean,
		bills: [] as Bill[],
		total_bills: 0 as number,
		detail: undefined as Bill | undefined,
		errors: [] as string[],
		filter: initialEmptySaleFilter,
	}),
	actions: {
		resetDetail() {
			this.detail = undefined;
		},

		async updateSalePageSize(size: number) {
			this.filter.page_size = size;

			if (this.filter.page_size > this.total_bills) {
				this.filter.current_page = 1;
				return;
			}

			this.getBills();
		},

		async updateSalePage(page: number) {
			this.filter.current_page = page;

			if (this.filter.current_page < 0 || this.total_bills === this.bills.length) {
				return;
			}

			this.getBills();
		},

		async getBills() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				let filter = '';

				// For 'All' status, don't add any status filter - let all statuses through
				if (this.filter.status !== 'All') {
					filter = `status eq '${this.filter.status}'`;
				}

				// Add date filter
				const dateFilter = this.filter.end_date
					? `(biz_date between '${getFormattedDate(this.filter.start_date, 'yyyy-MM-dd')}' and '${
							this.filter.end_date ? getFormattedDate(this.filter.end_date, 'yyyy-MM-dd') : undefined
						}')`
					: `biz_date le '${getFormattedDate(this.filter.start_date, 'yyyy-MM-dd')}'`;

				filter = filter ? `${filter} and ${dateFilter}` : dateFilter;

				// Add query filter if provided
				if (this.filter.query) {
					const queryFilter = `bill_no contains '${this.filter.query}'`;
					filter = filter ? `${filter} and ${queryFilter}` : queryFilter;
				}

				const { bills, total } = await $api.sale.getBills({
					$top: this.filter.page_size,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$count: true,
					$filter: filter,
					$orderby: 'biz_date desc, created_at desc',
					// $search: this.filter.query,
				});

				if (bills) {
					if (this.filter.current_page > 1 && this.total_bills > this.bills.length) {
						this.bills = [...this.bills, ...bills];
					} else {
						this.bills = bills;
					}

					this.total_bills = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			} finally {
				this.loading = false;
			}
		},

		async exportBills() {
			this.exporting = true;
			const { $api } = useNuxtApp();
			try {
				let filter = '';

				// For 'All' status, don't add any status filter - let all statuses through
				if (this.filter.status !== 'All') {
					filter = `status eq '${this.filter.status}'`;
				}

				// Add date filter
				const dateFilter = this.filter.end_date
					? `(biz_date between '${getFormattedDate(this.filter.start_date, 'yyyy-MM-dd')}' and '${
							this.filter.end_date ? getFormattedDate(this.filter.end_date, 'yyyy-MM-dd') : undefined
						}')`
					: `biz_date le '${getFormattedDate(this.filter.start_date, 'yyyy-MM-dd')}'`;

				filter = filter ? `${filter} and ${dateFilter}` : dateFilter;

				// Add query filter if provided
				if (this.filter.query) {
					const queryFilter = `bill_no contains '${this.filter.query}'`;
					filter = filter ? `${filter} and ${queryFilter}` : queryFilter;
				}

				const blob = await $api.sale.exportBills({
					$filter: filter,
					$orderby: 'biz_date desc',
					$count: true,
					$top: this.filter.page_size,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
				});

				if (blob) {
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = `bills_${getFormattedDate(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
					document.body.appendChild(link);
					link.click();

					document.body.removeChild(link);
					window.URL.revokeObjectURL(url);
					successNotification('Bills exported successfully');
				} else {
					failedNotification('Failed to export bills');
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.exporting = false;
			}
		},

		async getBillDetailsByBillNo(bill_no: string) {
			if (!this.detail) {
				this.loading = true;
			}

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
			} finally {
				this.loading = false;
			}
		},
	},
});
