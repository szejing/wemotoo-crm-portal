import { UserRoles } from 'wemotoo-common';
import type { StaffDepartment } from './staff-department';

type TranslateFn = (key: string) => string;

/** CRM / admin user as returned from the list and detail APIs */
export type CRMUser = {
	id: string;
	name: string;
	email_address: string;
	dial_code: string;
	phone_no: string;
	role: UserRoles;
	is_active: boolean;
	staff_department_id?: number | null;
	staff_department?: StaffDepartment;
	metadata?: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
};

export type CrmUserCreate = {
	name: string | undefined;
	email_address: string | undefined;
	dial_code: string | undefined;
	phone_no: string | undefined;
	role: UserRoles | undefined;
	is_active: boolean;
	staff_department_id?: number | null;
};

/** Form value for CRM user create / edit */
export type CrmUserUpdate = {
	name: string;
	email_address: string;
	dial_code: string;
	phone_no: string;
	role: UserRoles | undefined;
	is_active: boolean;
	staff_department_id?: number | null;
};
