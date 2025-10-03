import { defineStore } from 'pinia';
import { getFormattedDate, isEmptyOrNull, OrderStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { Order } from '~/utils/types/order';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { CustomerModel } from '~/utils/models/customer.model';
import type { ItemModel } from '~/utils/models/item.model';
import type { PaymentModel } from '~/utils/models/payment.model';

type OrderFilter = {
	query: string;
	status: OrderStatus;
	start_date: Date;
	end_date: Date | undefined;
	page_size: number;
	current_page: number;
	currency_code: string;
};

const initialEmptyOrderFilter: OrderFilter = {
	query: '',
	status: OrderStatus.NEW,
	start_date: new Date(),
	end_date: undefined,
	page_size: options_page_size[0],
	current_page: 1,
	currency_code: 'MYR',
};

export const useOrderStore = defineStore('orderStore', {
	state: () => ({
		loading: false as boolean,
		orders: [] as Order[],
		total_orders: 0 as number,
		detail: undefined as Order | undefined,
		errors: [] as string[],
		filter: initialEmptyOrderFilter,
	}),
	actions: {
		async updateOrderPageSize(size: number) {
			this.filter.page_size = size;

			if (this.filter.page_size > this.total_orders) {
				this.filter.current_page = 1;
				return;
			}

			this.getOrders();
		},

		async updateOrderPage(page: number) {
			this.filter.current_page = page;

			if (this.filter.current_page < 0 || this.total_orders === this.orders.length) {
				return;
			}

			this.getOrders();
		},

		async getOrders() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				let filter = `status eq '${this.filter.status}'`;
				if (this.filter.end_date) {
					filter += ` and (biz_date ge '${getFormattedDate(this.filter.start_date, 'yyyy-MM-dd')}' and biz_date le '${
						this.filter.end_date ? getFormattedDate(this.filter.end_date, 'yyyy-MM-dd') : undefined
					}')`;
				} else {
					filter += ` and biz_date eq '${getFormattedDate(this.filter.start_date, 'yyyy-MM-dd')}'`;
				}

				const { data, '@odata.count': total } = await $api.order.getOrders({
					$top: this.filter.page_size,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$count: true,
					$filter: filter,
					$search: isEmptyOrNull(this.filter.query) ? undefined : this.filter.query,
				});

				if (data) {
					if (this.filter.current_page > 1 && this.total_orders > this.orders.length) {
						this.orders = [...this.orders, ...data];
					} else {
						this.orders = data;
					}

					this.total_orders = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			} finally {
				this.loading = false;
			}
		},

		async getOrderByOrderNo(order_no: string) {
			const { $api } = useNuxtApp();
			try {
				const data = await $api.order.getOrderByOrderNo(order_no);

				if (data.order) {
					this.detail = data.order;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			}
		},

		setDetail(order: Order | undefined) {
			this.detail = order;
		},

		async updateOrderStatus(order_no: string, customer_no: string, status: string) {
			const { $api } = useNuxtApp();

			try {
				const data = await $api.order.updateOrderStatus(order_no, customer_no, status);

				if (data.status) {
					this.getOrderByOrderNo(order_no);
					successNotification('Order status updated successfully');
				}

				// if (status === OrderStatus.COMPLETED && this.detail?.payment_status == PaymentStatus.SUCCESS) {
				// 	const data = await $api.sale.updateOrderToSale(order_no, customer_no);

				// 	if (data.bill) {
				// 		this.detail = undefined;
				// 		successNotification('Order status updated successfully');
				// 	}
				// } else {

				// }
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			}
		},

		async updateOrder(order_no: string, customer_no: string, payment_status: string) {
			const { $api } = useNuxtApp();

			try {
				const data = await $api.order.updateOrder(order_no, customer_no, payment_status);

				if (data.status) {
					this.getOrderByOrderNo(order_no);
					successNotification('Payment status updated successfully');
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			}
		},

		async updatePayments(order_no: string, payment: PaymentModel) {
			const { $api } = useNuxtApp();

			let payments: PaymentModel[] = [];

			if (this.detail?.payments.length === 0) {
				payment.payment_line = 1;
				payments = [payment];
			} else {
				payments = this.detail?.payments ?? [];
			}

			try {
				const data = await $api.order.updatePayments(order_no, this.detail!.customer.customer_no, payments);

				if (data.status) {
					this.getOrderByOrderNo(order_no);
					successNotification('Payment Info Added successfully');
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			}
		},

		async updateCustomer(order_no: string, customer: CustomerModel) {
			const { $api } = useNuxtApp();

			try {
				const data = await $api.order.updateCustomer(order_no, customer);

				if (data.status) {
					this.getOrderByOrderNo(order_no);
					successNotification('Customer updated successfully');
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			}
		},

		async updateItems(order_no: string, item: ItemModel) {
			const { $api } = useNuxtApp();

			try {
				const items = this.detail?.items.map((orderItem) => {
					if (orderItem.item_line === item.item_line) {
						return item;
					}
					return orderItem;
				});

				const data = await $api.order.updateItems(order_no, this.detail!.customer.customer_no, items ?? []);

				if (data.status) {
					this.getOrderByOrderNo(order_no);
					successNotification('Order item updated successfully');
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				throw err;
			}
		},
	},
});
