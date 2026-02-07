import { UserRoles } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

/** CRM / admin user as returned from the list and detail APIs */
export type CRMUser = {
	id: string;
	name: string;
	email_address: string;
	dial_code: string;
	phone_no: string;
	role: UserRoles;
	metadata?: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
};

export type CrmUserCreate = {
	name: string | undefined;
	email_address: string | undefined;
	dial_code: string | undefined;
	phone_number: string | undefined;
	role: UserRoles | undefined;
};

/** Form value for CRM user create / edit */
export type CrmUserUpdate = {
	name: string;
	email_address: string;
	dial_code: string;
	phone_number: string;
	role: UserRoles | undefined;
};
