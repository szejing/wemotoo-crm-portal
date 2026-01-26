import type { UserRoles } from 'wemotoo-common';

export type User = {
	role: UserRoles;
	email_address: string;
	name: string;
	dial_code: string;
	phone_no: string;
};
