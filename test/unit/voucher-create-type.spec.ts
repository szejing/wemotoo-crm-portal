import { describe, expect, it } from 'vitest';
import { AllocationType } from 'wemotoo-common';
import {
	resolveAllocationFromVoucherCreateType,
	resolveVoucherCreateType,
	voucherListingPathForAllocation,
	VOUCHER_CREATE_TYPE,
} from '../../app/utils/voucher/create-type';

describe('resolveVoucherCreateType', () => {
	it('resolves supported values case-insensitively', () => {
		expect(resolveVoucherCreateType('shop')).toBe(VOUCHER_CREATE_TYPE.SHOP);
		expect(resolveVoucherCreateType('PRODUCT')).toBe(VOUCHER_CREATE_TYPE.PRODUCT);
	});

	it('returns undefined for unknown or invalid values', () => {
		expect(resolveVoucherCreateType('foo')).toBeUndefined();
		expect(resolveVoucherCreateType(undefined)).toBeUndefined();
		expect(resolveVoucherCreateType(1)).toBeUndefined();
	});
});

describe('resolveAllocationFromVoucherCreateType', () => {
	it('maps shop type to bill allocation', () => {
		expect(resolveAllocationFromVoucherCreateType(VOUCHER_CREATE_TYPE.SHOP)).toBe(AllocationType.BILL);
	});

	it('maps product type to item allocation', () => {
		expect(resolveAllocationFromVoucherCreateType(VOUCHER_CREATE_TYPE.PRODUCT)).toBe(AllocationType.ITEM);
	});
});

describe('voucherListingPathForAllocation', () => {
	it('maps bill allocation to shop listing path', () => {
		expect(voucherListingPathForAllocation(AllocationType.BILL)).toBe('/marketing/vouchers/shop');
	});

	it('maps item allocation to product listing path', () => {
		expect(voucherListingPathForAllocation(AllocationType.ITEM)).toBe('/marketing/vouchers/product');
	});
});
