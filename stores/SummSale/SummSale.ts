import type { SummDaily, SummCustomer, SummProduct } from '~/utils/types/summ-orders';
import { failedNotification } from '../AppUi/AppUi';
import type { SaleStatus, FilterType, OrderItemStatus } from 'wemotoo-common';
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

		async getSaleSummary() {
			this.sale_summ.is_loading = true;
			const { $api } = useNuxtApp();

			try {
				const data = await $api.summSales.getSummSales({
					filter_type: this.sale_summ.filter.filter_type as FilterType,
					status: this.sale_summ.filter.status as SaleStatus,
					start_date: getFormattedDate(this.sale_summ.filter.start_date),
					end_date: this.sale_summ.filter.end_date ? getFormattedDate(this.sale_summ.filter.end_date) : undefined,
					currency_code: this.sale_summ.filter.currency_code,
				});

				if (data.summ_sales) {
					this.sale_summ.data = data.summ_sales;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.sale_summ.is_loading = false;
			}
		},

		async getSaleItemSummary() {
			this.sale_summ_items.is_loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.summSales.getSummSalesItems({
					filter_type: this.sale_summ_items.filter.filter_type as FilterType,
					status: this.sale_summ_items.filter.status as SaleStatus,
					item_status: this.sale_summ_items.filter.item_status as OrderItemStatus,
					start_date: getFormattedDate(this.sale_summ_items.filter.start_date),
					end_date: this.sale_summ_items.filter.end_date ? getFormattedDate(this.sale_summ_items.filter.end_date) : undefined,
					currency_code: this.sale_summ_items.filter.currency_code,
				});
				if (data.summ_sale_items) {
					this.sale_summ_items.data = data.summ_sale_items;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.sale_summ_items.is_loading = false;
			}
		},

		async getSalePaymentSummary() {
			this.sale_summ_payments.is_loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.summSales.getSummSalesPayments({
					filter_type: this.sale_summ_payments.filter.filter_type as FilterType,
					status: this.sale_summ_payments.filter.status as SaleStatus,
					// payment_status: this.sale_summ_payments.filter.payment_status as PaymentStatus,
					start_date: getFormattedDate(this.sale_summ_payments.filter.start_date),
					end_date: this.sale_summ_payments.filter.end_date ? getFormattedDate(this.sale_summ_payments.filter.end_date) : undefined,
					currency_code: this.sale_summ_payments.filter.currency_code,
				});

				if (data.summ_sale_payments) {
					this.sale_summ_payments.data = data.summ_sale_payments;
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
				const data = await $api.summSales.getSummSalesCustomers({
					filter_type: this.sale_summ_customer.filter.filter_type as FilterType,
					status: this.sale_summ_customer.filter.status as SaleStatus,
					start_date: getFormattedDate(this.sale_summ_customer.filter.start_date),
					end_date: this.sale_summ_customer.filter.end_date ? getFormattedDate(this.sale_summ_customer.filter.end_date) : undefined,
					currency_code: this.sale_summ_customer.filter.currency_code,
				});
				if (data.summ_sale_customers) {
					this.sale_summ_customer.data = data.summ_sale_customers;
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
