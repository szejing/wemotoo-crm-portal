import type { StaffDepartment } from '~/utils/types/staff-department';

export type StaffDepartmentResp = {
	department: StaffDepartment;
};

export type StaffDepartmentsResp = {
	data?: StaffDepartment[];
	value?: StaffDepartment[];
	'@odata.count'?: number;
};

export type DeleteStaffDepartmentResp = {
	success: boolean;
};
