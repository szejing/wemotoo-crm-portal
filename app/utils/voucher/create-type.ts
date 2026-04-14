import { AllocationType } from 'wemotoo-common';

export const VOUCHER_CREATE_TYPE = {
	SHOP: 'shop',
	PRODUCT: 'product',
} as const;

export type VoucherCreateType = (typeof VOUCHER_CREATE_TYPE)[keyof typeof VOUCHER_CREATE_TYPE];

export const resolveVoucherCreateType = (value: unknown): VoucherCreateType | undefined => {
	if (typeof value !== 'string') {
		return undefined;
	}

	const normalized = value.trim().toLowerCase();
	if (normalized === VOUCHER_CREATE_TYPE.SHOP || normalized === VOUCHER_CREATE_TYPE.PRODUCT) {
		return normalized;
	}

	return undefined;
};

export const resolveAllocationFromVoucherCreateType = (type: VoucherCreateType): AllocationType => {
	if (type === VOUCHER_CREATE_TYPE.PRODUCT) {
		return AllocationType.ITEM;
	}
	return AllocationType.BILL;
};

/** CRM listing route for vouchers scoped by linked discount allocation. */
export const voucherListingPathForAllocation = (allocation: AllocationType): string =>
	allocation === AllocationType.ITEM ? '/marketing/vouchers/product' : '/marketing/vouchers/shop';
