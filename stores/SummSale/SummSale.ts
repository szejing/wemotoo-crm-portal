import type { SummDaily, SummCustomer, SummProduct } from '~/utils/types/summ-orders';
import { failedNotification } from '../AppUi/AppUi';
import { getFormattedDate } from 'wemotoo-common';
import { initialEmptySaleSumm } from './models/sale-summ.model';
import { initialEmptySaleSummItem } from './models/sale-summ-items.model';
import { initialEmptySaleSummPayment } from './models/sale-summ-payments.model';
import { initialEmptySaleSummCustomer } from './models/sale-summ-customer.model';

export const useSummSaleStore = defineStore('summSaleStore', {
	state: () => ({
		loading: false as boolean,
		errors: [] as string[],
		daily_summaries: [] as SummDaily[],
		top_purchased_customers: [] as SummCustomer[],
		top_purchased_products: [] as SummProduct[],
		sale_summ: initialEmptySaleSumm,
		sale_summ_items: initialEmptySaleSummItem,
		sale_summ_payments: initialEmptySaleSummPayment,
		sale_summ_customer: initialEmptySaleSummCustomer,
	}),
	actions: {
		async getDashboardSummary(start_date?: Date, end_date?: Date) {
			this.loading = true;
			const { $api } = useNuxtApp();

			if (end_date == undefined) {
				end_date = new Date();
				end_date.setHours(0, 0, 0, 0);
			}

			if (start_date == undefined) {
				start_date = new Date(end_date);
				start_date.setDate(start_date.getDate() - 7);
			}

			try {
				const data = await $api.summOrder.getDashboardOrderSummary({
					start_date: getFormattedDate(start_date!),
					end_date: getFormattedDate(end_date!),
				});

				if (data.daily_summaries) {
					this.daily_summaries = data.daily_summaries;
				}

				if (data.top_purchased_customers) {
					this.top_purchased_customers = data.top_purchased_customers;
				}

				if (data.top_purchased_products) {
					this.top_purchased_products = data.top_purchased_products;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async updateSaleSummPageSize(size: number) {
			this.sale_summ.page_size = size;

			if (this.sale_summ.page_size > this.sale_summ.total_data) {
				this.sale_summ.current_page = 1;
				return;
			}

			this.getSaleSummary();
		},

		async updateSaleSummPage(page: number) {
			this.sale_summ.current_page = page;

			if (this.sale_summ.current_page < 0 || this.sale_summ.total_data === this.sale_summ.data.length) {
				return;
			}

			this.getSaleSummary();
		},

		async getSaleSummary() {
			this.sale_summ.is_loading = true;
			const { $api } = useNuxtApp();

			try {
				let filter = `status eq '${this.sale_summ.filter.status}'`;

				if (this.sale_summ.filter.currency_code) {
					filter += ` and currency_code eq '${this.sale_summ.filter.currency_code}'`;
				}

				if (this.sale_summ.filter.end_date) {
					filter += ` and (biz_date between '${getFormattedDate(this.sale_summ.filter.start_date, 'yyyy-MM-dd')}' and '${
						this.sale_summ.filter.end_date ? getFormattedDate(this.sale_summ.filter.end_date, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date eq '${getFormattedDate(this.sale_summ.filter.start_date, 'yyyy-MM-dd')}'`;
				}

				const { data, '@odata.count': total } = await $api.summSales.getSummSales({
					$filter: filter,
					$orderby: 'biz_date desc',
					$top: this.sale_summ.page_size,
					$skip: (this.sale_summ.current_page - 1) * this.sale_summ.page_size,
				});

				if (data) {
					if (this.sale_summ.current_page > 1 && this.sale_summ.total_data > this.sale_summ.data.length) {
						this.sale_summ.data = [...this.sale_summ.data, ...data];
					} else {
						this.sale_summ.data = data;
					}

					this.sale_summ.total_data = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.sale_summ.is_loading = false;
			}
		},

		async updateSaleItemSummPageSize(size: number) {
			this.sale_summ_items.page_size = size;
			this.getSaleItemSummary();

			if (this.sale_summ_items.page_size > this.sale_summ_items.total_data) {
				this.sale_summ_items.current_page = 1;
				return;
			}

			this.getSaleItemSummary();
		},

		async updateSaleItemSummPage(page: number) {
			this.sale_summ_items.current_page = page;

			if (this.sale_summ_items.current_page < 0 || this.sale_summ_items.total_data === this.sale_summ_items.data.length) {
				return;
			}

			this.getSaleItemSummary();
		},

		async getSaleItemSummary() {
			this.sale_summ_items.is_loading = true;
			const { $api } = useNuxtApp();
			try {
				let filter = `status eq '${this.sale_summ_items.filter.status}'`;

				if (this.sale_summ_items.filter.currency_code) {
					filter += ` and currency_code eq '${this.sale_summ_items.filter.currency_code}'`;
				}

				if (this.sale_summ_items.filter.end_date) {
					filter += ` and (biz_date between '${getFormattedDate(this.sale_summ_items.filter.start_date, 'yyyy-MM-dd')}' and '${
						this.sale_summ_items.filter.end_date ? getFormattedDate(this.sale_summ_items.filter.end_date, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date eq '${getFormattedDate(this.sale_summ_items.filter.start_date, 'yyyy-MM-dd')}'`;
				}

				const { data, '@odata.count': total } = await $api.summSales.getSummSalesItems({
					$filter: filter,
					$orderby: 'biz_date desc',
					$count: true,
					$top: this.sale_summ_items.page_size,
					$skip: (this.sale_summ_items.current_page - 1) * this.sale_summ_items.page_size,
				});
				if (data) {
					if (this.sale_summ_items.current_page > 1 && this.sale_summ_items.total_data > this.sale_summ_items.data.length) {
						this.sale_summ_items.data = [...this.sale_summ_items.data, ...data];
					} else {
						this.sale_summ_items.data = data;
					}

					this.sale_summ_items.total_data = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.sale_summ_items.is_loading = false;
			}
		},

		async updateSalePaymentSummPageSize(size: number) {
			this.sale_summ_payments.page_size = size;
			this.getSalePaymentSummary();

			if (this.sale_summ_payments.page_size > this.sale_summ_payments.total_data) {
				this.sale_summ_payments.current_page = 1;
				return;
			}

			this.getSalePaymentSummary();
		},

		async updateSalePaymentSummPage(page: number) {
			this.sale_summ_payments.current_page = page;

			if (this.sale_summ_payments.current_page < 0 || this.sale_summ_payments.total_data === this.sale_summ_payments.data.length) {
				return;
			}

			this.getSalePaymentSummary();
		},

		async getSalePaymentSummary() {
			this.sale_summ_payments.is_loading = true;
			const { $api } = useNuxtApp();
			try {
				let filter = `status eq '${this.sale_summ_payments.filter.status}'`;

				if (this.sale_summ_payments.filter.currency_code) {
					filter += ` and currency_code eq '${this.sale_summ_payments.filter.currency_code}'`;
				}

				if (this.sale_summ_payments.filter.end_date) {
					filter += ` and (biz_date between '${getFormattedDate(this.sale_summ_payments.filter.start_date, 'yyyy-MM-dd')}' and '${
						this.sale_summ_payments.filter.end_date ? getFormattedDate(this.sale_summ_payments.filter.end_date, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date eq '${getFormattedDate(this.sale_summ_payments.filter.start_date, 'yyyy-MM-dd')}'`;
				}

				const { data, '@odata.count': total } = await $api.summSales.getSummSalesPayments({
					$filter: filter,
					$orderby: 'biz_date desc',
					$count: true,
					$top: this.sale_summ_payments.page_size,
					$skip: (this.sale_summ_payments.current_page - 1) * this.sale_summ_payments.page_size,
				});

				if (data) {
					if (this.sale_summ_payments.current_page > 1 && this.sale_summ_payments.total_data > this.sale_summ_payments.data.length) {
						this.sale_summ_payments.data = [...this.sale_summ_payments.data, ...data];
					} else {
						this.sale_summ_payments.data = data;
					}

					this.sale_summ_payments.total_data = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.sale_summ_payments.is_loading = false;
			}
		},

		async getSaleCustomerSummary() {
			this.sale_summ_customer.is_loading = true;
			const { $api } = useNuxtApp();

			try {
				let filter = `status eq '${this.sale_summ_payments.filter.status}'`;

				if (this.sale_summ_payments.filter.currency_code) {
					filter += ` and currency_code eq '${this.sale_summ_payments.filter.currency_code}'`;
				}

				if (this.sale_summ_payments.filter.end_date) {
					filter += ` and (biz_date between '${getFormattedDate(this.sale_summ_payments.filter.start_date, 'yyyy-MM-dd')}' and '${
						this.sale_summ_payments.filter.end_date ? getFormattedDate(this.sale_summ_payments.filter.end_date, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date eq '${getFormattedDate(this.sale_summ_payments.filter.start_date, 'yyyy-MM-dd')}'`;
				}

				const { data } = await $api.summSales.getSummSalesCustomers({
					$filter: filter,
					$orderby: 'biz_date desc',
					$count: true,
					$top: this.sale_summ_customer.page_size,
					$skip: (this.sale_summ_customer.current_page - 1) * this.sale_summ_customer.page_size,
				});

				if (data) {
					this.sale_summ_customer.data = data;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.sale_summ_customer.is_loading = false;
			}
		},
	},
});
