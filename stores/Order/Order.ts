import { defineStore } from 'pinia';
import type { FilterType } from 'wemotoo-common';
import { getFormattedDate, isEmptyOrNull, OrderStatus, PaymentStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { Order } from '~/utils/types/order';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { CustomerModel } from '~/utils/models/customer.model';
import type { ItemModel } from '~/utils/models/item.model';
import type { PaymentModel } from '~/utils/models/payment.model';

type OrderFilter = {
	query: string;
	status: OrderStatus;
	filter_type: 'between' | '=';
	start_date: Date;
	end_date: Date | undefined;
	page_size: number;
	currency_code: string;
};

const initialEmptyOrderFilter: OrderFilter = {
	query: '',
	status: OrderStatus.NEW,
	filter_type: '=',
	start_date: new Date(),
	end_date: undefined,
	page_size: options_page_size[0],
	currency_code: 'MYR',
};

export const useOrderStore = defineStore('orderStore', {
	state: () => ({
		loading: false as boolean,
		orders: [] as Order[],
		detail: undefined as Order | undefined,
		errors: [] as string[],
		filter: initialEmptyOrderFilter,
	}),
	actions: {
		async getOrders() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.order.getOrders({
					limit: this.filter.page_size,
					offset: 0,
					filter_type: this.filter.filter_type as FilterType,
					start_date: getFormattedDate(this.filter.start_date),
					end_date: this.filter.end_date ? getFormattedDate(this.filter.end_date) : undefined,
					status: this.filter.status,
					q: isEmptyOrNull(this.filter.query) ? undefined : this.filter.query,
				});

				if (data) {
					this.orders = data.orders;
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
				const data = await $api.order.getOrderByOrderNo(encodeURIComponent(order_no));

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
				if (status === OrderStatus.COMPLETED && this.detail?.payment_status == PaymentStatus.SUCCESS) {
					const data = await $api.sale.updateOrderToSale(order_no, customer_no);

					if (data.bill) {
						this.detail = undefined;
						successNotification('Order status updated successfully');
					}
				} else {
					const data = await $api.order.updateOrderStatus(order_no, customer_no, status);

					if (data.order) {
						this.detail = data.order;
						successNotification('Order status updated successfully');
					}
				}
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

				if (data.order) {
					this.detail = data.order;
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

				if (data.order) {
					this.detail = data.order;
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

				if (data.order) {
					this.detail = data.order;
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

				if (data.order) {
					this.detail = data.order;
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
