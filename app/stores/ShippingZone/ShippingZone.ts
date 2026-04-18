import { defineStore } from 'pinia';
import { options_page_size } from '../../utils/options';
import { successNotification, failedNotification } from '../AppUi/AppUi';
import type { ShippingZoneMutableFields, ShippingZoneRecord } from '~/utils/types/order-fulfillment-shipping';

type ShippingZoneFilter = {
	query: string;
	status: 'active' | 'inactive' | undefined;
	current_page: number;
	page_size: number;
};

const initialEmptyFilter: ShippingZoneFilter = {
	query: '',
	status: undefined,
	current_page: 1,
	page_size: options_page_size[0] as number,
};

function newZoneId(): string {
	const c = globalThis.crypto;
	if (c?.randomUUID) {
		return `sz_${c.randomUUID()}`;
	}
	return `sz_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const useShippingZoneStore = defineStore('shippingZoneStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		removing: false as boolean,
		exporting: false as boolean,
		/** Current page rows (client-filtered slice of `allZones`). */
		zones: [] as ShippingZoneRecord[],
		total_shipping_zones: 0 as number,
		/** In-memory master list until API is wired. */
		allZones: [] as ShippingZoneRecord[],
		filter: initialEmptyFilter,
		errors: [] as string[],
	}),
	getters: {
		getDisplayZones: (state) => state.zones,
	},
	actions: {
		async updatePageSize(size: number) {
			this.filter.page_size = size;
			this.filter.current_page = 1;
			await this.getShippingZones();
		},

		async updatePage(page: number) {
			this.filter.current_page = page;
			if (this.filter.current_page < 1) {
				return;
			}
			await this.getShippingZones();
		},

		/**
		 * Applies search/status filters, sorts, and paginates in memory.
		 * TODO(api): replace with OData/API call and server-side pagination.
		 */
		async getShippingZones() {
			this.loading = true;
			try {
				let list = [...this.allZones];
				const q = this.filter.query.trim().toLowerCase();
				if (q) {
					list = list.filter((z) => {
						const name = z.name.toLowerCase();
						const cc = z.country_code.toLowerCase();
						const st = (z.state ?? '').toLowerCase();
						return name.includes(q) || cc.includes(q) || st.includes(q);
					});
				}
				if (this.filter.status === 'active') {
					list = list.filter((z) => z.is_active);
				} else if (this.filter.status === 'inactive') {
					list = list.filter((z) => !z.is_active);
				}

				list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

				this.total_shipping_zones = list.length;
				const start = (this.filter.current_page - 1) * this.filter.page_size;
				this.zones = list.slice(start, start + this.filter.page_size);
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to load shipping zones';
				failedNotification(message);
				throw err;
			} finally {
				this.loading = false;
			}
		},

		getShippingZone(id: string): ShippingZoneRecord | undefined {
			return this.allZones.find((z) => z.id === id);
		},

		async createShippingZone(payload: ShippingZoneMutableFields): Promise<ShippingZoneRecord | undefined> {
			this.adding = true;
			try {
				// TODO(api): POST shipping zone, then merge response into `allZones`.
				const now = new Date().toISOString();
				const row: ShippingZoneRecord = {
					id: newZoneId(),
					...payload,
					created_at: now,
					updated_at: now,
				};
				this.allZones = [row, ...this.allZones];
				successNotification('Shipping zone created');
				await this.getShippingZones();
				return row;
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to create shipping zone';
				failedNotification(message);
				throw err;
			} finally {
				this.adding = false;
			}
		},

		async updateShippingZone(
			id: string,
			payload: Partial<Omit<ShippingZoneRecord, 'id' | 'created_at'>>,
		): Promise<ShippingZoneRecord | undefined> {
			this.updating = true;
			try {
				// TODO(api): PATCH shipping zone by id.
				const idx = this.allZones.findIndex((z) => z.id === id);
				if (idx === -1) {
					failedNotification('Shipping zone not found');
					return undefined;
				}
				const prev = this.allZones[idx];
				const next: ShippingZoneRecord = {
					...prev,
					...payload,
					id: prev.id,
					created_at: prev.created_at,
					updated_at: new Date().toISOString(),
				};
				this.allZones = [...this.allZones.slice(0, idx), next, ...this.allZones.slice(idx + 1)];
				successNotification('Shipping zone updated');
				await this.getShippingZones();
				return next;
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to update shipping zone';
				failedNotification(message);
				throw err;
			} finally {
				this.updating = false;
			}
		},

		async updateZoneStatus(zone: ShippingZoneRecord, is_active: boolean) {
			await this.updateShippingZone(zone.id, { is_active });
		},

		async deleteShippingZone(id: string): Promise<void> {
			this.removing = true;
			try {
				// TODO(api): DELETE shipping zone by id.
				const idx = this.allZones.findIndex((z) => z.id === id);
				if (idx === -1) {
					failedNotification('Shipping zone not found');
					return;
				}
				this.allZones = [...this.allZones.slice(0, idx), ...this.allZones.slice(idx + 1)];
				successNotification('Shipping zone deleted');
				await this.getShippingZones();
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to delete shipping zone';
				failedNotification(message);
				throw err;
			} finally {
				this.removing = false;
			}
		},

		async exportShippingZones() {
			this.exporting = true;
			try {
				// Export not wired for shipping zones yet
			} finally {
				this.exporting = false;
			}
		},
	},
});
