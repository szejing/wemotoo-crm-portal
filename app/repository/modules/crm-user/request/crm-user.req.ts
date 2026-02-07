import type { UserRoles } from 'wemotoo-common';

export type CrmUserReq = {
	id: string;
	name: string;
	email_address: string;
	dial_code: string;
	phone_no: string;
	role: UserRoles;
	is_active: boolean;
};
