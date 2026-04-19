import { defineStore } from 'pinia';
import { KEY } from 'wemotoo-common';
import { options_page_size } from '../../utils/options';
import { successNotification, failedNotification } from '../AppUi/AppUi';
import { useAuthStore } from '../Auth/Auth';
import type { ShippingZoneMutableFields, ShippingZoneRecord } from '~/utils/types/order-fulfillment-shipping';
import type { ErrorResponse } from '~/repository/base/error';

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

function mapShippingZoneFromApi(raw: Record<string, unknown>): ShippingZoneRecord {
	const links = (raw.method_links as Record<string, unknown>[] | undefined) ?? [];
	const methods = links.map((l) => {
		const sm = l.shipping_method as Record<string, unknown> | undefined;
		const sid = (sm?.id as string) ?? (l.shipping_method_id as string);
		const feeRaw = l.fee ?? l.fee_override;
		const fee = typeof feeRaw === 'string' ? Number(feeRaw) : Number(feeRaw ?? 0);
		const ed = l.estimated_days ?? l.estimated_days_override;
		return {
			shipping_method_id: sid,
			fee,
			estimated_days: ed != null && !Number.isNaN(Number(ed)) ? Number(ed) : null,
		};
	});
	const shipping_method_ids = methods.map((m) => m.shipping_method_id);
	const pricing_summary = links
		.map((l) => {
			const sm = l.shipping_method as Record<string, unknown> | undefined;
			const name = String(sm?.name ?? '');
			const feeRaw = l.fee ?? l.fee_override;
			const fee = typeof feeRaw === 'string' ? Number(feeRaw) : Number(feeRaw ?? 0);
			return name ? `${name}: ${fee}` : String(fee);
		})
		.join(' · ');

	const activeRaw = raw.is_active;
	const is_active = activeRaw === false || activeRaw === 0 ? false : true;

	return {
		id: String(raw.id),
		name: String(raw.name ?? ''),
		is_active,
		country_code: String(raw.country_code ?? 'MY').toUpperCase(),
		state: raw.state != null ? String(raw.state) : undefined,
		postcode_patterns: (raw.postcode_patterns as ShippingZoneRecord['postcode_patterns']) ?? [],
		methods,
		shipping_method_ids,
		pricing_summary,
		created_at: String(raw.created_at ?? new Date().toISOString()),
		updated_at: String(raw.updated_at ?? new Date().toISOString()),
	};
}

export const useShippingZoneStore = defineStore('shippingZoneStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		removing: false as boolean,
		exporting: false as boolean,
		zones: [] as ShippingZoneRecord[],
		total_shipping_zones: 0 as number,
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

		async getShippingZones() {
			this.loading = true;
			try {
				const { $api } = useNuxtApp();
				const resp = await $api.shippingZone.getMany();
				const rows = ((resp.shipping_zones ?? []) as Record<string, unknown>[]).map((z) =>
					mapShippingZoneFromApi(z),
				);
				this.allZones = rows;

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
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? (err instanceof Error ? err.message : 'Failed to load shipping zones');
				failedNotification(message);
				throw err;
			} finally {
				this.loading = false;
			}
		},

		getShippingZone(id: string): ShippingZoneRecord | undefined {
			return this.allZones.find((z) => z.id === id);
		},

		async loadShippingZoneById(id: string, opts?: { forceRefresh?: boolean }): Promise<ShippingZoneRecord | undefined> {
			if (!opts?.forceRefresh) {
				await this.getShippingZones();
				const cached = this.getShippingZone(id);
				if (cached) {
					return cached;
				}
			}
			const { $api } = useNuxtApp();
			try {
				const resp = await $api.shippingZone.getSingle(id);
				const row = mapShippingZoneFromApi(resp.shipping_zone as Record<string, unknown>);
				this.allZones = [row, ...this.allZones.filter((z) => z.id !== row.id)];
				return row;
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Shipping zone not found';
				failedNotification(message);
				return undefined;
			}
		},

		async createShippingZone(payload: ShippingZoneMutableFields): Promise<ShippingZoneRecord | undefined> {
			const { $api } = useNuxtApp();
			const merchant_id = String(useCookie(KEY.X_MERCHANT_ID).value ?? '');
			this.adding = true;
			try {
				const { shipping_method_ids: _ids, ...body } = payload;
				const resp = await $api.shippingZone.create({
					merchant_id,
					...body,
				});
				const row = mapShippingZoneFromApi(resp.shipping_zone as Record<string, unknown>);
				this.allZones = [row, ...this.allZones.filter((z) => z.id !== row.id)];
				successNotification('Shipping zone created');
				await this.getShippingZones();
				return row;
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to create shipping zone';
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
			const { $api } = useNuxtApp();
			const merchant_id = String(useCookie(KEY.X_MERCHANT_ID).value ?? '');
			this.updating = true;
			try {
				const body = { ...payload } as Record<string, unknown>;
				delete body.shipping_method_ids;
				delete body.pricing_summary;
				delete body.id;
				delete body.created_at;
				delete body.updated_at;
				const resp = await $api.shippingZone.update(id, {
					merchant_id,
					...(body as Omit<ShippingZoneRecord, 'id' | 'created_at' | 'shipping_method_ids' | 'pricing_summary'>),
				});
				const row = mapShippingZoneFromApi(resp.shipping_zone as Record<string, unknown>);
				const idx = this.allZones.findIndex((z) => z.id === id);
				if (idx === -1) {
					this.allZones = [row, ...this.allZones];
				} else {
					this.allZones = [...this.allZones.slice(0, idx), row, ...this.allZones.slice(idx + 1)];
				}
				successNotification('Shipping zone updated');
				await this.getShippingZones();
				return row;
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to update shipping zone';
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
			const { $api } = useNuxtApp();
			const merchant_id = String(useCookie(KEY.X_MERCHANT_ID).value ?? '');
			const authStore = useAuthStore();
			this.removing = true;
			try {
				await $api.shippingZone.remove(id, {
					merchant_id,
					user: authStore.user ? { id: authStore.user.id } : { id: '' },
				});
				this.allZones = this.allZones.filter((z) => z.id !== id);
				successNotification('Shipping zone deleted');
				await this.getShippingZones();
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to delete shipping zone';
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
