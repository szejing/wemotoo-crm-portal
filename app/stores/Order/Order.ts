/* eslint-disable indent */
/* eslint-disable @stylistic/indent */
import { defineStore } from 'pinia';
import { defaultOrderRelations, getFormattedDate, removeDuplicateExpands, OrderStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ErrorResponse } from '~/repository/base/error';
import type { CustomerModel } from '~/utils/models/customer.model';
import type { ItemModel } from '~/utils/models/item.model';
import type { PaymentModel } from '~/utils/models/payment.model';
import type { Range } from '~/utils/interface';
import { sub } from 'date-fns';
import type { OrderHistory } from '~/utils/types/order-history';
import type { Order } from '~/utils/types/order';

type OrderFilter = {
	query: string;
	status: OrderStatus | undefined;
	date_range: Range;
	page_size: number;
	current_page: number;
	currency_code: string;
};

const initialEmptyOrderFilter: OrderFilter = {
	query: '',
	status: undefined,
	date_range: {
		start: sub(new Date(), { days: 14 }),
		end: new Date(),
	},
	page_size: options_page_size[0] as number,
	current_page: 1,
	currency_code: 'MYR',
};

export const useOrderStore = defineStore('orderStore', {
	state: () => ({
		loading: false as boolean,
		updating: false as boolean,
		exporting: false as boolean,
		orders: [] as OrderHistory[],
		total_orders: 0 as number,
		detail: undefined as Order | undefined,
		errors: [] as string[],
		filter: initialEmptyOrderFilter,
	}),
	actions: {
		resetDetail() {
			this.detail = undefined;
		},

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
				let filter = '';

				// For 'All' status, don't add any status filter - let all statuses through
				if (this.filter.status === OrderStatus.PENDING_PAYMENT) {
					filter = `status in ('${OrderStatus.PENDING_PAYMENT}', '${OrderStatus.PROCESSING}')`;
				} else if (this.filter.status === OrderStatus.COMPLETED) {
					filter = `status eq '${OrderStatus.COMPLETED}'`;
				} else if (this.filter.status === OrderStatus.CANCELLED) {
					filter = `status in ('${OrderStatus.CANCELLED}', '${OrderStatus.REFUNDED}')`;
				}

				let { start, end } = this.filter.date_range;

				start = start ?? new Date();
				end = end ?? new Date();

				// Add date filter
				const dateFilter = end
					? `(biz_date between '${getFormattedDate(start, 'yyyy-MM-dd')}' and '${getFormattedDate(end, 'yyyy-MM-dd')}')`
					: `biz_date le '${getFormattedDate(start, 'yyyy-MM-dd')}'`;

				filter = filter ? `${filter} and ${dateFilter}` : dateFilter;

				// Add query filter if provided
				if (this.filter.query) {
					const queryFilter = `order_no contains '${this.filter.query}'`;
					filter = filter ? `${filter} and ${queryFilter}` : queryFilter;
				}

				const { data, '@odata.count': total } = await $api.order.getOrders({
					$top: this.filter.page_size,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$count: true,
					$filter: filter,
					$expand: removeDuplicateExpands(defaultOrderRelations).join(','),
					$orderby: 'biz_date desc, created_at desc',
				});

				if (data) {
					if (this.filter.current_page > 1 && this.total_orders > this.orders.length) {
						this.orders = [...this.orders, ...data];
					} else {
						this.orders = data;
					}

					this.total_orders = total ?? 0;
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process order';
				failedNotification(message);
				throw err;
			} finally {
				this.loading = false;
			}
		},

		async getOrderByOrderNo(order_no: string) {
			if (!this.detail) {
				this.loading = true;
			}
			const { $api } = useNuxtApp();
			try {
				const data = await $api.order.getOrderByTransactionNo(order_no);

				if (data.order) {
					this.detail = data.order;
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process order';
				failedNotification(message);
				throw err;
			} finally {
				this.loading = false;
			}
		},

		async updateOrderStatus(order_no: string, customer_no: string, status: string) {
			const { $api } = useNuxtApp();
			this.updating = true;

			try {
				const data = await $api.order.updateOrderStatus(order_no, customer_no, status);

				if (data?.status && status !== OrderStatus.COMPLETED) {
					this.getOrderByOrderNo(order_no);
					successNotification('Order status updated successfully');
				} else {
					useRouter().back();
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process order';
				failedNotification(message);
				throw err;
			} finally {
				this.updating = false;
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
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process order';
				failedNotification(message);
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
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process order';
				failedNotification(message);
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
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process order';
				failedNotification(message);
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
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process order';
				failedNotification(message);
				throw err;
			}
		},

		async exportOrders() {
			this.exporting = true;
			const { $api } = useNuxtApp();
			try {
				let filter = '';

				// For 'All' status, don't add any status filter - let all statuses through
				if (this.filter.status === OrderStatus.PENDING_PAYMENT) {
					filter = `status in ('${OrderStatus.PENDING_PAYMENT}', '${OrderStatus.PROCESSING}')`;
				} else if (this.filter.status === OrderStatus.COMPLETED) {
					filter = `status eq '${OrderStatus.COMPLETED}'`;
				} else if (this.filter.status === OrderStatus.CANCELLED) {
					filter = `status in ('${OrderStatus.CANCELLED}', '${OrderStatus.REFUNDED}')`;
				}

				let { start, end } = this.filter.date_range;

				start = start ?? new Date();
				end = end ?? new Date();

				// Add date filter
				const dateFilter = end
					? `(biz_date between '${getFormattedDate(start, 'yyyy-MM-dd')}' and '${getFormattedDate(end, 'yyyy-MM-dd')}')`
					: `biz_date le '${getFormattedDate(start, 'yyyy-MM-dd')}'`;

				filter = filter ? `${filter} and ${dateFilter}` : dateFilter;

				// Add query filter if provided
				if (this.filter.query) {
					const queryFilter = `order_no contains '${this.filter.query}'`;
					filter = filter ? `${filter} and ${queryFilter}` : queryFilter;
				}

				const blob = await $api.order.exportOrders({
					$top: this.filter.page_size,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$count: true,
					$filter: filter,
					$expand: removeDuplicateExpands(defaultOrderRelations).join(','),
					$orderby: 'biz_date desc, created_at desc',
				});

				if (blob) {
					// Create a download link and trigger download
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = `orders_${getFormattedDate(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
					document.body.appendChild(link);
					link.click();

					// Cleanup
					document.body.removeChild(link);
					window.URL.revokeObjectURL(url);

					successNotification('Orders exported successfully');
				} else {
					failedNotification('Failed to export orders');
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process order';
				failedNotification(message);
				throw err;
			} finally {
				this.exporting = false;
			}
		},
	},
});
