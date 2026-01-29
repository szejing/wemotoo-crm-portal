import { defineStore } from 'pinia';
import { MerchantInfo } from '~/utils/types/merchant-info';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { Currency } from '~/utils/types/currency';

const initial: MerchantInfo[] = [];

type MerchantInfoUpdate = { group_code: string; set_code: string; set_value: string };

export const useMerchantInfoStore = defineStore('merchantInfoStore', {
	state: () => ({
		loading: false as boolean,
		// merchant: undefined as MerchantInfo | undefined,
		merchant: structuredClone(initial),
		updatedInfo: [] as MerchantInfoUpdate[],
		currencies: [] as Currency[],
		errors: [] as string[],
	}),
	actions: {
		getMerchantInfo(group_code: string, set_code: string): MerchantInfo | null {
			const info = this.merchant.find((info) => info.group_code === group_code && info.set_code === set_code);

			return info || null;
		},

		addToUpdatedInfo(info: MerchantInfoUpdate) {
			const existing = this.updatedInfo.find((s) => s.set_code === info.set_code);
			if (existing) {
				existing.set_value = info.set_value;
			} else {
				this.updatedInfo.push({ ...info });
			}
		},

		clearUpdatedInfo() {
			this.updatedInfo = [];
		},

		async updateMerchantInfo() {
			if (this.updatedInfo.length === 0) return;
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data } = await $api.merchantInfo.saveMany({
					merchant_info: this.updatedInfo.map((info) => new MerchantInfo(info)),
				});

				if (data) {
					this.merchant = data.map((info) => new MerchantInfo(info));
				}
				successNotification('Merchant information updated');
			} catch (err: any) {
				failedNotification(err?.message ?? 'Failed to update merchant information');
			} finally {
				this.loading = false;
			}
		},

		async getMerchantInfos() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data } = await $api.merchantInfo.getMany({
					$count: true,
					$top: 100,
				});

				if (data) {
					this.merchant = data.map((info) => new MerchantInfo(info));
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async getCurrencies() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data } = await $api.currency.getCurrencies({
					$top: 1,
					$skip: 0,
				});

				if (data) {
					this.currencies = data;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},
	},
});
