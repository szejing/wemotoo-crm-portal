import { z } from 'zod';
import { CreateDiscountValidation } from '../../Discount/Create/CreateDiscountValidation';
import { CreateVoucherValidation } from './CreateVoucherValidation';

type TranslateFn = (key: string) => string;

/** Single-form validation for voucher create + bundled discount create. */
export function CreateBundledVoucherFormValidation(t: TranslateFn) {
	return z.object({
		voucher: CreateVoucherValidation(t, { linkDiscountToVoucher: true }),
		discount: CreateDiscountValidation(t),
	});
}
