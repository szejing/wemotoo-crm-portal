import type { User } from '~/utils/types/user';

export type LoginResp = {
	user: User;
	token: string;
	refresh_token: string;
	exclude_routes: string[];
};
