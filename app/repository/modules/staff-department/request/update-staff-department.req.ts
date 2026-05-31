export type UpdateStaffDepartmentReq = {
	name?: string;
	default_commission_rate?: number;
	is_active?: boolean;
	metadata?: Record<string, unknown>;
};
