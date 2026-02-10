export type BrandInput = {
	code: string;
};

export type Brand = {
	code: string;
	description: string;
	slug: string;
	is_active: boolean;

	// ignore
	total_products?: number;
};
