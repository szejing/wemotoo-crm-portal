import type { UserRoles } from 'wemotoo-common';

export type UpdateCrmUserReq = {
	name?: string;
	email_address?: string;
	dial_code?: string;
	phone_no?: string;
	role?: UserRoles;
	is_active?: boolean;
};
