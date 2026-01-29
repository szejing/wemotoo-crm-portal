import type { User } from '~/utils/types/user';
import type { MerchantInfo } from '~/utils/types/merchant-info';

export type LoginResp = {
	user: User;
	token: string;
	refresh_token: string;
};
