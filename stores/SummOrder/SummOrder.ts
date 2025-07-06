import type { SummDaily, SummCustomer, SummProduct } from '~/utils/types/summ-orders';
import { failedNotification } from '../AppUi/AppUi';
import { initialEmptyOrderSumm } from './model/order-summ.model';
import { initialEmptyOrderSummItem } from './model/order-summ-item.model';
import { getFormattedDate } from 'wemotoo-common';
import { initialEmptyOrderSummCustomer } from './model/order-summ-customer.model';

export const useSummOrderStore = defineStore('summOrderStore', {
	state: () => ({
		loading: false as boolean,
		errors: [] as string[],
		daily_summaries: [] as SummDaily[],
		top_purchased_customers: [] as SummCustomer[],
		top_purchased_products: [] as SummProduct[],
		new_orders: 0 as number,
		new_customers: 0 as number,
		total_sales_amt: 0 as number,
		order_summ: initialEmptyOrderSumm,
		order_summ_item: initialEmptyOrderSummItem,
		order_summ_customer: initialEmptyOrderSummCustomer,
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

				if (data.new_orders) {
					this.new_orders = data.new_orders;
				}

				if (data.new_customers) {
					this.new_customers = data.new_customers;
				}

				if (data.total_sales_amt) {
					this.total_sales_amt = data.total_sales_amt;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async updateOrderSummPageSize(size: number) {
			this.order_summ.page_size = size;

			if (this.order_summ.page_size > this.order_summ.total_data) {
				this.order_summ.current_page = 1;
				return;
			}

			this.getOrderSummary();
		},

		async updateOrderSummPage(page: number) {
			this.order_summ.current_page = page;

			if (this.order_summ.current_page < 0 || this.order_summ.total_data === this.order_summ.data.length) {
				return;
			}

			this.getOrderSummary();
		},

		async getOrderSummary() {
			this.order_summ.is_loading = true;
			const { $api } = useNuxtApp();

			try {
				let filter = `status eq '${this.order_summ.filter.status}'`;

				if (this.order_summ.filter.currency_code) {
					filter += ` and currency_code eq '${this.order_summ.filter.currency_code}'`;
				}

				if (this.order_summ.filter.end_date) {
					filter += ` and (biz_date ge '${getFormattedDate(this.order_summ.filter.start_date, 'yyyy-MM-dd')}' and biz_date le '${
						this.order_summ.filter.end_date ? getFormattedDate(this.order_summ.filter.end_date, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date eq '${getFormattedDate(this.order_summ.filter.start_date, 'yyyy-MM-dd')}'`;
				}

				const { data, '@odata.count': total } = await $api.summOrder.getSummOrders({
					$filter: filter,
					$orderby: 'biz_date desc',
					$count: true,
					$top: this.order_summ.page_size,
					$skip: (this.order_summ.current_page - 1) * this.order_summ.page_size,
				});

				if (data) {
					if (this.order_summ.current_page > 1 && this.order_summ.total_data > this.order_summ.data.length) {
						this.order_summ.data = [...this.order_summ.data, ...data];
					} else {
						this.order_summ.data = data;
					}

					this.order_summ.total_data = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.order_summ.is_loading = false;
			}
		},

		async updateOrderItemSummPageSize(size: number) {
			this.order_summ_item.page_size = size;
			this.getOrderItemSummary();

			if (this.order_summ_item.page_size > this.order_summ_item.total_data) {
				this.order_summ_item.current_page = 1;
				return;
			}
		},

		async updateOrderItemSummPage(page: number) {
			this.order_summ_item.current_page = page;

			if (this.order_summ_item.current_page < 0 || this.order_summ_item.total_data === this.order_summ_item.data.length) {
				return;
			}

			this.getOrderItemSummary();
		},

		async getOrderItemSummary() {
			this.order_summ_item.is_loading = true;
			const { $api } = useNuxtApp();

			try {
				let filter = `status eq '${this.order_summ_item.filter.status}'`;

				if (this.order_summ_item.filter.currency_code) {
					filter += ` and currency_code eq '${this.order_summ_item.filter.currency_code}'`;
				}

				if (this.order_summ_item.filter.end_date) {
					filter += ` and (biz_date ge '${getFormattedDate(this.order_summ_item.filter.start_date, 'yyyy-MM-dd')}' and biz_date le '${
						this.order_summ_item.filter.end_date ? getFormattedDate(this.order_summ_item.filter.end_date, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date eq '${getFormattedDate(this.order_summ_item.filter.start_date, 'yyyy-MM-dd')}'`;
				}

				const { data, '@odata.count': total } = await $api.summOrder.getSummOrderItems({
					$filter: filter,
					$orderby: 'biz_date desc',
					$count: true,
					$top: this.order_summ_item.page_size,
					$skip: (this.order_summ_item.current_page - 1) * this.order_summ_item.page_size,
				});

				if (data) {
					if (this.order_summ_item.current_page > 1 && this.order_summ_item.total_data > this.order_summ_item.data.length) {
						this.order_summ_item.data = [...this.order_summ_item.data, ...data];
					} else {
						this.order_summ_item.data = data;
					}

					this.order_summ_item.total_data = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.order_summ_item.is_loading = false;
			}
		},

		async updateOrderCustomerSummPageSize(size: number) {
			this.order_summ_customer.page_size = size;
			this.getOrderCustomerSummary();

			if (this.order_summ_customer.page_size > this.order_summ_customer.total_data) {
				this.order_summ_customer.current_page = 1;
				return;
			}
		},

		async updateOrderCustomerSummPage(page: number) {
			this.order_summ_customer.current_page = page;

			if (this.order_summ_customer.current_page < 0 || this.order_summ_customer.total_data === this.order_summ_customer.data.length) {
				return;
			}

			this.getOrderCustomerSummary();
		},

		async getOrderCustomerSummary() {
			this.order_summ_customer.is_loading = true;
			const { $api } = useNuxtApp();

			try {
				let filter = `status eq '${this.order_summ_customer.filter.status}'`;

				if (this.order_summ_customer.filter.currency_code) {
					filter += ` and currency_code eq '${this.order_summ_customer.filter.currency_code}'`;
				}

				if (this.order_summ_customer.filter.end_date) {
					filter += ` and (biz_date ge '${getFormattedDate(this.order_summ_customer.filter.start_date, 'yyyy-MM-dd')}' and biz_date le '${
						this.order_summ_customer.filter.end_date ? getFormattedDate(this.order_summ_customer.filter.end_date, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date eq '${getFormattedDate(this.order_summ_customer.filter.start_date, 'yyyy-MM-dd')}'`;
				}

				const { data, '@odata.count': total } = await $api.summOrder.getSummOrderCustomers({
					$filter: filter,
					$orderby: 'biz_date desc',
					$count: true,
					$top: this.order_summ_customer.page_size,
					$skip: (this.order_summ_customer.current_page - 1) * this.order_summ_customer.page_size,
				});

				if (data) {
					if (this.order_summ_customer.current_page > 1 && this.order_summ_customer.total_data > this.order_summ_customer.data.length) {
						this.order_summ_customer.data = [...this.order_summ_customer.data, ...data];
					} else {
						this.order_summ_customer.data = data;
					}

					this.order_summ_customer.total_data = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.order_summ_customer.is_loading = false;
			}
		},
	},
});
