import { ProductStatus } from 'wemotoo-common';
import type { TranslateFn } from './order-status';

export const options_product_status = [ProductStatus.DRAFT, ProductStatus.PUBLISHED];

export function getProductStatusOptions(t: TranslateFn) {
	return [
		{ value: ProductStatus.DRAFT, label: t('options.draft') },
		{ value: ProductStatus.PUBLISHED, label: t('options.published') },
	];
}

export const getProductStatusColor = (status: string): 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined => {
	const color: Record<string, 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined> = {
		[ProductStatus.DRAFT]: 'warning',
		[ProductStatus.PUBLISHED]: 'success',
		All: 'neutral',
	};

	return color[status as keyof typeof color] as 'primary' | 'error' | 'success' | 'warning' | 'secondary' | 'info' | 'neutral' | undefined;
};
