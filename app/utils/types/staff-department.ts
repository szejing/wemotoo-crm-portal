export type StaffCommissionRule = {
	id: string;
	product_category_code?: string;
	commission_rate: number;
	priority: number;
	is_active: boolean;
	metadata?: Record<string, unknown>;
};

export type StaffDepartment = {
	id: number;
	name: string;
	default_commission_rate: number;
	is_active: boolean;
	metadata?: Record<string, unknown>;
	commission_rules?: StaffCommissionRule[];
	created_at?: string;
	updated_at?: string;
};

export type StaffDepartmentPayload = {
	name: string;
	default_commission_rate: number;
	is_active?: boolean;
	metadata?: Record<string, unknown>;
};
