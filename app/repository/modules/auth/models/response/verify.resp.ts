import type { User } from '~/utils/types/user';

export type VerifyResp = {
	user: User;
	exclude_routes: string[];
};
