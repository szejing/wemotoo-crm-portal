import { ProductStatus } from 'wemotoo-common';

export const options_product_status = [ProductStatus.DRAFT, ProductStatus.PUBLISHED];

export const getProductStatusColor = (status: string): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined => {
	const color: Record<string, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined> = {
		[ProductStatus.DRAFT]: 'warning',
		[ProductStatus.PUBLISHED]: 'success',
		All: 'neutral',
	};

	return color[status as keyof typeof color] as 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined;
};
