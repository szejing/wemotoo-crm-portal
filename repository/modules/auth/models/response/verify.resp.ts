import type { MerchantInfo } from '~/utils/types/merchant-info';
import type { User } from '~/utils/types/user';

export type VerifyResp = {
	user: User;
	merchant_info: MerchantInfo[];
};
