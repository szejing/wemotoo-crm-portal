import { defineStore } from 'pinia';
import type { MerchantInfo } from '~/utils/types/merchant-info';

const initial: MerchantInfo[] = [];

export const useMerchantInfoStore = defineStore({
	id: 'merchantInfoStore',
	state: () => ({
		loading: false as boolean,
		// merchant: undefined as MerchantInfo | undefined,
		merchant: structuredClone(initial),
		errors: [] as string[],
	}),
	actions: {
		setMerchantInfo(merchantInfo: MerchantInfo[]) {
			this.merchant = merchantInfo;
		},

		getMerchantInfo(group_code: string, set_code: string): MerchantInfo | null {
			const info = this.merchant.find((info) => info.group_code === group_code && info.set_code === set_code);

			return info || null;
		},
	},
});
