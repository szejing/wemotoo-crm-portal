import { defineStore } from 'pinia';
import { Package } from '~/utils/enum/package';
import { AccountStatus } from '~/utils/enum/status';
import type { MerchantInfo } from '~/utils/types/merchant';

const initial: MerchantInfo = {
	name: 'Wemotoo',
	merchant_id: 'Wemotoo_888',
	expires_date: new Date(2025, 12, 31),
	date_joined: new Date(),
	status: AccountStatus.ACTIVE,
	package: Package.GOLD,
	profile_thumbnail: 'https://play-lh.googleusercontent.com/wQy4wAUVQPanpINDiu2uY4sNy3TxHobxkD3ZamfCAQm1rrtcd5idA13cZEhqb27C_LqP',
	address: {
		address1: 'A-3A-08, Block A, Menara Prima, Jalan PJU 1/39',
		address2: 'Dataran Prima',
		city: 'Bandar Utama',
		country_code: 'MY',
		state: 'Selangor',
		postal_code: '47800',
	},
};

export const useMerchantInfoStore = defineStore({
	id: 'merchantInfoStore',
	state: () => ({
		loading: false as boolean,
		// merchant: undefined as MerchantInfo | undefined,
		merchant: structuredClone(initial),
		errors: [] as string[],
	}),
	actions: {},
});
