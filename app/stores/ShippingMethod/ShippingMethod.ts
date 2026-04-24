import { defineStore } from 'pinia';
import { KEY } from 'wemotoo-common';
import { options_page_size } from '../../utils/options';
import { successNotification, failedNotification } from '../AppUi/AppUi';
import type { ErrorResponse } from '~/repository/base/error';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { ShippingMethodOption } from '~/utils/types/order-fulfillment-shipping';
import type { CreateShippingMethodReq } from '~/repository/modules/shipping-method/models/request/create-shipping-method.req';
import type { UpdateShippingMethodReq } from '~/repository/modules/shipping-method/models/request/update-shipping-method.req';

type ShippingMethodFilter = {
	query: string;
	status: 'active' | 'inactive' | undefined;
	current_page: number;
	page_size: number;
};

const initialEmptyFilter: ShippingMethodFilter = {
	query: '',
	status: undefined,
	current_page: 1,
	page_size: options_page_size[0] as number,
};

export const useShippingMethodStore = defineStore('shippingMethodStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		removing: false as boolean,
		exporting: false as boolean,
		methods: [] as ShippingMethodOption[],
		total_shipping_methods: 0 as number,
		current_shipping_method: undefined as ShippingMethodOption | undefined,
		filter: initialEmptyFilter,
		errors: [] as string[],
	}),
	getters: {
		getDisplayMethods: (state) => state.methods,
	},
	actions: {
		async updatePageSize(size: number) {
			this.filter.page_size = size;
			this.filter.current_page = 1;
			await this.getShippingMethods();
		},

		async updatePage(page: number) {
			this.filter.current_page = page;

			if (this.filter.current_page < 0) {
				return;
			}

			await this.getShippingMethods();
		},

		async getShippingMethods(append = false) {
			const { $api } = useNuxtApp();

			try {
				const queryParams: BaseODataReq = {
					$top: this.filter.page_size,
					$count: true,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$orderby: 'priority desc',
				};

				const q = this.filter.query.trim();
				if (q) {
					queryParams.$search = q;
				}

				if (this.filter.status === 'active') {
					queryParams.$filter = 'is_active eq true';
				} else if (this.filter.status === 'inactive') {
					queryParams.$filter = 'is_active eq false';
				}

				const resp = await $api.shippingMethod.getMany(queryParams);
				const data = resp.data ?? resp.value ?? [];
				const total = resp['@odata.count'] ?? resp.count ?? 0;

				if (data) {
					this.methods = append ? [...this.methods, ...data] : data;
					this.total_shipping_methods = total ?? 0;
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to load shipping methods';
				failedNotification(message);
				throw err;
			}
		},

		async loadMoreShippingMethods() {
			if (this.loading || this.methods.length >= this.total_shipping_methods) return;

			this.loading = true;
			this.filter.current_page += 1;

			try {
				await this.getShippingMethods(true);
			} finally {
				this.loading = false;
			}
		},

		// async resolveShippingMethodsForAddress(params: { country_code?: string; state?: string; postal_code?: string }): Promise<ShippingMethodOption[]> {
		// 	const { $api } = useNuxtApp();
		// 	try {
		// 		const response = await $api.shippingMethod.resolveMethods(params);
		// 		return (response.resolved ?? []).map((row: ResolvedShippingMethodRow) => ({
		// 			...row.shipping_method,
		// 			fee: row.effective_fee,
		// 			estimated_days: row.effective_estimated_days ?? row.shipping_method.estimated_days,
		// 		}));
		// 	} catch (err: unknown | ErrorResponse) {
		// 		const message = (err as ErrorResponse).message ?? 'Failed to resolve shipping methods';
		// 		failedNotification(message);
		// 		throw err;
		// 	}
		// },

		async exportShippingMethods() {
			this.exporting = true;
			try {
				// Export not wired for shipping methods yet
			} finally {
				this.exporting = false;
			}
		},

		async getShippingMethod(id: string): Promise<ShippingMethodOption | undefined> {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const response = await $api.shippingMethod.getSingle(id);

				this.current_shipping_method = response.shipping_method;
				return response.shipping_method;
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to load shipping method';
				failedNotification(message);
				throw err;
			} finally {
				this.loading = false;
			}
		},

		async createShippingMethod(payload: Omit<CreateShippingMethodReq, 'merchant_id'>): Promise<ShippingMethodOption | undefined> {
			const { $api } = useNuxtApp();
			const merchant_id = useCookie(KEY.X_MERCHANT_ID).value;
			this.adding = true;

			const buildShippingMethodCode = (description: string): string => {
				const core = description
					.trim()
					.toUpperCase()
					.replace(/[^A-Z0-9]+/g, '_')
					.replace(/^_+|_+$/g, '')
					.slice(0, 24);
				const suffix = Date.now().toString(36).toUpperCase().slice(-4);
				return `${core || 'SM'}_${suffix}`.slice(0, 32);
			};

			try {
				const response = await $api.shippingMethod.create({
					merchant_id: String(merchant_id ?? ''),
					...payload,
					code: payload.code ?? buildShippingMethodCode(payload.description),
				});
				this.current_shipping_method = response.shipping_method;
				await this.getShippingMethods();
				successNotification('Shipping method created');
				return response.shipping_method;
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to create shipping method';
				failedNotification(message);
				throw err;
			} finally {
				this.adding = false;
			}
		},

		async updateStatus(method: ShippingMethodOption, is_active: boolean) {
			await this.updateShippingMethod(method.id, { is_active });
		},

		async updateShippingMethod(id: string, payload: Omit<UpdateShippingMethodReq, 'merchant_id'>): Promise<ShippingMethodOption | undefined> {
			const { $api } = useNuxtApp();
			const merchant_id = useCookie(KEY.X_MERCHANT_ID).value;
			this.updating = true;

			try {
				const response = await $api.shippingMethod.update(id, {
					merchant_id: String(merchant_id ?? ''),
					...payload,
				});
				this.current_shipping_method = response.shipping_method;
				await this.getShippingMethods();
				successNotification('Shipping method updated');
				return response.shipping_method;
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to update shipping method';
				failedNotification(message);
				throw err;
			} finally {
				this.updating = false;
			}
		},

		async deleteShippingMethod(id: string): Promise<ShippingMethodOption | undefined> {
			const { $api } = useNuxtApp();
			this.removing = true;

			try {
				const response = await $api.shippingMethod.remove(id);
				this.current_shipping_method = response.shipping_method;
				await this.getShippingMethods();
				successNotification('Shipping method deleted');
				return response.shipping_method;
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to delete shipping method';
				failedNotification(message);
				throw err;
			} finally {
				this.removing = false;
			}
		},
	},
});
