import type { UserRoles } from 'wemotoo-common';

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

/** Form value for CRM user create / edit */
export type CrmUserFormValue = {
	name: string;
	email_address: string;
	dial_code: string;
	phone_number: string;
	role: UserRoles | undefined;
};
