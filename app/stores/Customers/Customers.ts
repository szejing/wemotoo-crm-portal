import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { Customer } from '~/utils/types/customer';
import { failedNotification } from '../AppUi/AppUi';
import type { ErrorResponse } from '~/repository/base/error';
import { sub } from 'date-fns';
import type { Range } from '~/utils/interface';
import { getFormattedDate } from 'wemotoo-common';
import type { BaseODataReq } from '~/repository/base/base.req';

type CustomerFilter = {
	query: string;
	joined_date: Range;
	page_size: number;
	current_page: number;
};

const initialEmptyCustomerFilter: CustomerFilter = {
	query: '',
	joined_date: {
		start: sub(new Date(), { days: 14 }),
		end: new Date(),
	},
	page_size: options_page_size[0] as number,
	current_page: 1,
};

export const useCustomerStore = defineStore('customerStore', {
	state: () => ({
		loading: false as boolean,
		exporting: false as boolean,
		customers: [] as Customer[],
		total_customers: 0 as number,
		errors: [] as string[],
		filter: initialEmptyCustomerFilter,
	}),
	actions: {
		async updatePageSize(size: number) {
			this.filter.page_size = size;

			if (this.filter.page_size > this.customers.length) {
				this.filter.current_page = 1;
				return;
			}

			this.getCustomers();
		},

		async updatePage(page: number) {
			this.filter.current_page = page;

			if (this.filter.current_page < 0 || this.customers.length === this.total_customers) {
				return;
			}

			this.getCustomers();
		},

		async getCustomers() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { query, joined_date } = this.filter;

				let filter = '';

				if (joined_date.start && joined_date.end) {
					const joinedDateFilter = `created_at between '${getFormattedDate(joined_date.start, 'yyyy-MM-dd')}' and '${getFormattedDate(joined_date.end, 'yyyy-MM-dd')}'`;
					filter = filter ? `${filter} and ${joinedDateFilter}` : joinedDateFilter;
				}

				// Add query filter if provided
				if (query) {
					const queryFilter = `(customer_no contains '${query}' or name contains '${query}' or phone_no contains '${query}' or email_address contains '${query}')`;
					filter = filter ? `${filter} and ${queryFilter}` : queryFilter;
				}

				const queryParams: BaseODataReq = {
					$top: this.filter.page_size,
					$count: true,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$orderby: 'created_at desc',
				};

				// Only add $filter if it's not empty
				if (filter) {
					queryParams.$filter = filter;
				}

				const { data, '@odata.count': total } = await $api.customer.getMany(queryParams);

				if (data) {
					if (this.filter.current_page > 1 && this.total_customers > this.customers.length) {
						this.customers = [...this.customers, ...data];
					} else {
						this.customers = data;
					}

					this.total_customers = total ?? 0;
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to load customers';
				failedNotification(message);
			} finally {
				this.loading = false;
			}
		},

		async exportCustomers() {
			this.exporting = true;
			// const { $api } = useNuxtApp();
			// try {
			// 	const blob = await $api.customer.exportCustomers();
			// } catch (err: any) {
			// 	console.error(err);
			// 	failedNotification(err.message);
			// } finally {
			// 	this.exporting = false;
			// }
		},
	},
});
