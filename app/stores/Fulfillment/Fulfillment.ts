import { defineStore } from 'pinia';
import { KEY } from 'wemotoo-common';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ErrorResponse } from '~/repository/base/error';
import type { OrderFulfillment } from '~/utils/types/order-fulfillment-shipping';

export const useFulfillmentStore = defineStore('fulfillmentStore', {
	state: () => ({
		loading: false as boolean,
		creating: false as boolean,
		updating: false as boolean,
		lastFulfillment: undefined as OrderFulfillment | undefined,
	}),
	actions: {
		async createFulfillment(order_no: string): Promise<OrderFulfillment | undefined> {
			const { $api } = useNuxtApp();
			const merchant_id = useCookie(KEY.X_MERCHANT_ID).value;
			this.creating = true;

			try {
				const response = await $api.fulfillment.create(order_no, {
					merchant_id: String(merchant_id ?? ''),
				});
				this.lastFulfillment = response.fulfillment;
				successNotification('Fulfillment created');
				return response.fulfillment;
			} catch (err: unknown | ErrorResponse) {
				const message =
					(err as ErrorResponse).message ?? 'Failed to create fulfillment';
				failedNotification(message);
				throw err;
			} finally {
				this.creating = false;
			}
		},

		async markProcessing(order_no: string): Promise<OrderFulfillment | undefined> {
			return this.updateState(order_no, 'processing');
		},

		async markPacked(order_no: string): Promise<OrderFulfillment | undefined> {
			return this.updateState(order_no, 'packed');
		},

		async markFulfilled(order_no: string): Promise<OrderFulfillment | undefined> {
			return this.updateState(order_no, 'fulfilled');
		},

		async updateState(
			order_no: string,
			next: 'processing' | 'packed' | 'fulfilled',
		): Promise<OrderFulfillment | undefined> {
			const { $api } = useNuxtApp();
			const merchant_id = useCookie(KEY.X_MERCHANT_ID).value;
			this.updating = true;

			try {
				const body = { merchant_id: String(merchant_id ?? '') };
				const response =
					next === 'processing'
						? await $api.fulfillment.markProcessing(order_no, body)
						: next === 'packed'
							? await $api.fulfillment.markPacked(order_no, body)
							: await $api.fulfillment.markFulfilled(order_no, body);

				this.lastFulfillment = response.fulfillment;
				successNotification(`Fulfillment marked as ${next}`);
				return response.fulfillment;
			} catch (err: unknown | ErrorResponse) {
				const message =
					(err as ErrorResponse).message ?? 'Failed to update fulfillment';
				failedNotification(message);
				throw err;
			} finally {
				this.updating = false;
			}
		},
	},
});
