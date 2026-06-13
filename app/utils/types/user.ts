import type { UserRoles } from 'yeppi-common';

export type User = {
	id: string;
	role: UserRoles;
	email_address: string;
	name: string;
	dial_code: string;
	phone_no: string;
};
