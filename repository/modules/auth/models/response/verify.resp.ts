import type { UserRoles } from 'wemotoo-common';
import type { MerchantInfo } from '~/utils/types/merchant-info';

export type VerifyResp = {
	user: {
		role: UserRoles;
		email_address: string;
		first_name: string;
		last_name: string;
		phone_number: string;
	};
	merchant_info: MerchantInfo[];
};
