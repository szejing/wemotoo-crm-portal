import type { UserRoles } from 'wemotoo-common';

export type CreateCrmUserReq = {
	name: string;
	email_address: string;
	dial_code: string;
	phone_number: string;
	role: UserRoles;
};
