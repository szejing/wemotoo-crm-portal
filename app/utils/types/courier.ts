export type Courier = {
	id: number;
	name: string;
	description?: string | null;
	is_active: boolean;
	created_at?: string | Date;
	updated_at?: string | Date;
};

export type CourierResp = {
	courier: Courier;
};
