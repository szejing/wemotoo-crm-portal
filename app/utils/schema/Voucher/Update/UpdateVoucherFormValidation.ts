import { z } from 'zod';
import { CreateDiscountValidation } from '../../Discount/Create/CreateDiscountValidation';
import { CreateVoucherValidation } from '../Create/CreateVoucherValidation';

type TranslateFn = (key: string) => string;

/** Single-form validation for voucher edit + linked discount rule/conditions. */
export function UpdateVoucherFormValidation(t: TranslateFn, opts: { linkDiscountToVoucher: boolean }) {
	return z.object({
		voucher: CreateVoucherValidation(t, { linkDiscountToVoucher: opts.linkDiscountToVoucher }),
		discount: CreateDiscountValidation(t),
	});
}
