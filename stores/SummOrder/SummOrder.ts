import type { SummDaily, SummCustomer, SummProduct } from '~/utils/types/summ-orders';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import { initialEmptyOrderSumm } from './model/order-summ.model';
import { initialEmptyOrderSummItem } from './model/order-summ-item.model';
import { getFormattedDate } from 'wemotoo-common';
import { initialEmptyOrderSummCustomer } from './model/order-summ-customer.model';
import type { Range } from '~/utils/interface';

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
		async getDashboardSummary(range?: Range) {
			this.loading = true;
			let { start, end } = range ?? { start: undefined, end: undefined };
			const { $api } = useNuxtApp();

			if (end == undefined) {
				end = new Date();
				end.setHours(0, 0, 0, 0);
			}

			if (start == undefined) {
				start = new Date(end);
				start.setDate(start.getDate() - 7);
			}

			try {
				console.log(start, end);
				const data = await $api.summOrder.getDashboardOrderSummary({
					start_date: getFormattedDate(start!),
					end_date: getFormattedDate(end!),
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
			this.order_summ.loading = true;
			const { $api } = useNuxtApp();

			try {
				let filter = `status eq '${this.order_summ.filter.status}'`;

				if (this.order_summ.filter.currency_code) {
					filter += ` and currency_code eq '${this.order_summ.filter.currency_code}'`;
				}

				if (this.order_summ.filter.date_range.end) {
					filter += ` and (biz_date between '${getFormattedDate(this.order_summ.filter.date_range.start!, 'yyyy-MM-dd')}' and '${
						this.order_summ.filter.date_range.end ? getFormattedDate(this.order_summ.filter.date_range.end!, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date le '${getFormattedDate(this.order_summ.filter.date_range.start!, 'yyyy-MM-dd')}'`;
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
				this.order_summ.loading = false;
			}
		},

		async exportOrderSummary() {
			this.order_summ.exporting = true;
			const { $api } = useNuxtApp();

			try {
				let filter = `status eq '${this.order_summ.filter.status}'`;

				if (this.order_summ.filter.currency_code) {
					filter += ` and currency_code eq '${this.order_summ.filter.currency_code}'`;
				}

				if (this.order_summ.filter.date_range.end) {
					filter += ` and (biz_date between '${getFormattedDate(this.order_summ.filter.date_range.start!, 'yyyy-MM-dd')}' and '${
						this.order_summ.filter.date_range.end ? getFormattedDate(this.order_summ.filter.date_range.end!, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date le '${getFormattedDate(this.order_summ.filter.date_range.start!, 'yyyy-MM-dd')}'`;
				}

				const blob = await $api.summOrder.exportSummOrders({ $filter: filter, $orderby: 'biz_date desc' });

				if (blob) {
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = `summ_orders_${getFormattedDate(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
					document.body.appendChild(link);
					link.click();

					document.body.removeChild(link);
					window.URL.revokeObjectURL(url);

					successNotification('Order summary exported successfully');
				} else {
					failedNotification('Failed to export order summary');
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.order_summ.loading = false;
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
			this.order_summ_item.loading = true;
			const { $api } = useNuxtApp();

			try {
				let filter = `status eq '${this.order_summ_item.filter.status}'`;

				if (this.order_summ_item.filter.currency_code) {
					filter += ` and currency_code eq '${this.order_summ_item.filter.currency_code}'`;
				}

				if (this.order_summ_item.filter.date_range.end) {
					filter += ` and (biz_date between '${getFormattedDate(this.order_summ_item.filter.date_range.start!, 'yyyy-MM-dd')}' and '${
						this.order_summ_item.filter.date_range.end ? getFormattedDate(this.order_summ_item.filter.date_range.end!, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date le '${getFormattedDate(this.order_summ_item.filter.date_range.start!, 'yyyy-MM-dd')}'`;
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
				this.order_summ_item.loading = false;
			}
		},

		async exportOrderItemSummary() {
			this.order_summ_item.exporting = true;
			const { $api } = useNuxtApp();

			try {
				let filter = `status eq '${this.order_summ_item.filter.status}'`;

				if (this.order_summ_item.filter.currency_code) {
					filter += ` and currency_code eq '${this.order_summ_item.filter.currency_code}'`;
				}

				if (this.order_summ_item.filter.date_range.end) {
					filter += ` and (biz_date between '${getFormattedDate(this.order_summ_item.filter.date_range.start!, 'yyyy-MM-dd')}' and '${
						this.order_summ_item.filter.date_range.end ? getFormattedDate(this.order_summ_item.filter.date_range.end!, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date le '${getFormattedDate(this.order_summ_item.filter.date_range.start!, 'yyyy-MM-dd')}'`;
				}

				const blob = await $api.summOrder.exportSummOrderItems({ $filter: filter, $orderby: 'biz_date desc' });

				if (blob) {
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = `summ_order_items_${getFormattedDate(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
					document.body.appendChild(link);
					link.click();

					document.body.removeChild(link);
					window.URL.revokeObjectURL(url);

					successNotification('Order items exported successfully');
				} else {
					failedNotification('Failed to export order items');
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.order_summ_item.exporting = false;
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
			this.order_summ_customer.loading = true;
			const { $api } = useNuxtApp();

			try {
				let filter = `status eq '${this.order_summ_customer.filter.status}'`;

				if (this.order_summ_customer.filter.currency_code) {
					filter += ` and currency_code eq '${this.order_summ_customer.filter.currency_code}'`;
				}

				if (this.order_summ_customer.filter.date_range.end) {
					filter += ` and (biz_date between '${getFormattedDate(this.order_summ_customer.filter.date_range.start!, 'yyyy-MM-dd')}' and '${
						this.order_summ_customer.filter.date_range.end ? getFormattedDate(this.order_summ_customer.filter.date_range.end!, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date le '${getFormattedDate(this.order_summ_customer.filter.date_range.start!, 'yyyy-MM-dd')}'`;
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
				this.order_summ_customer.loading = false;
			}
		},

		async exportOrderCustomerSummary() {
			this.order_summ_customer.exporting = true;
			const { $api } = useNuxtApp();

			try {
				let filter = `status eq '${this.order_summ_customer.filter.status}'`;

				if (this.order_summ_customer.filter.currency_code) {
					filter += ` and currency_code eq '${this.order_summ_customer.filter.currency_code}'`;
				}

				if (this.order_summ_customer.filter.date_range.end) {
					filter += ` and (biz_date between '${getFormattedDate(this.order_summ_customer.filter.date_range.start!, 'yyyy-MM-dd')}' and '${
						this.order_summ_customer.filter.date_range.end ? getFormattedDate(this.order_summ_customer.filter.date_range.end!, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date le '${getFormattedDate(this.order_summ_customer.filter.date_range.start!, 'yyyy-MM-dd')}'`;
				}

				const blob = await $api.summOrder.exportSummOrderCustomers({ $filter: filter, $orderby: 'biz_date desc' });

				if (blob) {
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = `summ_order_customers_${getFormattedDate(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
					document.body.appendChild(link);
					link.click();

					document.body.removeChild(link);
					window.URL.revokeObjectURL(url);

					successNotification('Order customers exported successfully');
				} else {
					failedNotification('Failed to export order customers');
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.order_summ_customer.exporting = false;
			}
		},
	},
});
