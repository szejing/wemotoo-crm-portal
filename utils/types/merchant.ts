import type { Package } from '../enum/package';
import type { AccountStatus } from '../enum/account-status';
import type { Address } from './address';

export type MerchantInfo = {
	name: string;
	merchant_id: string;
	expires_date: Date;
	date_joined: Date;
	status: AccountStatus;
	package: Package;
	profile_thumbnail: string;
	address: Address;
};
