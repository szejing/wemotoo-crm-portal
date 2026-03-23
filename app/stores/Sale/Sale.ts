/* eslint-disable indent */
/* eslint-disable @stylistic/indent */
import { defineStore } from 'pinia';
import type { OrderStatus } from 'wemotoo-common';
import { getFormattedDate } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ErrorResponse } from '~/repository/base/error';
import type { Bill } from '~/utils/types/bill';

type SaleFilter = {
	query: string;
	status: OrderStatus | string;
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
		filter: initialEmptySaleFilter,
	}),
	actions: {
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

				const queryParams = {
					$top: this.filter.page_size,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$count: true,
					$filter: filter,
					$orderby: 'biz_date desc, created_at desc',
				} as const;

				// Use backend $search support for text search
				if (this.filter.query) {
					(queryParams as any).$search = this.filter.query;
				}

				const { bills, total } = await $api.sale.getBills(queryParams);

				if (bills) {
					this.bills = bills;
					this.total_bills = total ?? 0;
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process sale';
				failedNotification(message);
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

				const queryParams = {
					$filter: filter,
					$orderby: 'biz_date desc',
					$count: true,
					$top: this.filter.page_size,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
				} as const;

				// Use backend $search support for text search
				if (this.filter.query) {
					(queryParams as any).$search = this.filter.query;
				}

				const blob = await $api.sale.exportBills(queryParams);

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
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process sale';
				failedNotification(message);
			} finally {
				this.exporting = false;
			}
		},

		async getBillDetailsByBillNo(order_no: string): Promise<Bill | undefined> {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.sale.getBillDetailsByOrderNo(order_no);

				return data.bill ?? undefined;
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process sale';
				failedNotification(message);
				throw err;
			} finally {
				this.loading = false;
			}
		},
	},
});
