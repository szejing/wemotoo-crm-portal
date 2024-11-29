import { defineStore } from 'pinia';
import type { MerchantInfo } from '~/utils/types/merchant-info';
import { failedNotification } from '../AppUi/AppUi';
import type { Currency } from '~/utils/types/currency';

const initial: MerchantInfo[] = [];

export const useMerchantInfoStore = defineStore({
	id: 'merchantInfoStore',
	state: () => ({
		loading: false as boolean,
		// merchant: undefined as MerchantInfo | undefined,
		merchant: structuredClone(initial),
		currencies: [] as Currency[],
		errors: [] as string[],
	}),
	actions: {
		async setMerchantInfo(merchantInfo: MerchantInfo[]) {
			this.merchant = merchantInfo;
		},

		getMerchantInfo(group_code: string, set_code: string): MerchantInfo | null {
			const info = this.merchant.find((info) => info.group_code === group_code && info.set_code === set_code);

			return info || null;
		},

		async getCurrencies() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.currency.getCurrencies();

				if (data.currencies) {
					this.currencies = data.currencies;
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
