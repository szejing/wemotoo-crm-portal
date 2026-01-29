import { defineStore } from 'pinia';
import { MerchantInfo } from '~/utils/types/merchant-info';
import { failedNotification } from '../AppUi/AppUi';
import type { Currency } from '~/utils/types/currency';

const initial: MerchantInfo[] = [];

export const useMerchantInfoStore = defineStore('merchantInfoStore', {
	state: () => ({
		loading: false as boolean,
		// merchant: undefined as MerchantInfo | undefined,
		merchant: structuredClone(initial),
		currencies: [] as Currency[],
		errors: [] as string[],
	}),
	actions: {
		async setMerchantInfo(merchantInfo: MerchantInfo[]) {
			this.merchant = merchantInfo.map((info) => new MerchantInfo(info));
		},

		getMerchantInfo(group_code: string, set_code: string): MerchantInfo | null {
			const info = this.merchant.find((info) => info.group_code === group_code && info.set_code === set_code);

			return info || null;
		},

		updateFromSettings(settings: Array<{ group_code: string; set_code: string; set_value: string }>, infoGroupCode: string) {
			settings
				.filter((s) => s.group_code === infoGroupCode)
				.forEach((s) => {
					const existing = this.merchant.find((m) => m.group_code === s.group_code && m.set_code === s.set_code);
					if (existing) {
						existing.set_value = s.set_value;
					} else {
						this.merchant.push(new MerchantInfo(s as MerchantInfo));
					}
				});
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
