import { z } from 'zod';
import { UserRoles } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

export function UpdateCRMUserValidation(t: TranslateFn) {
	return z.object({
		name: z.string({ message: t('validation.crmUser.nameRequired') }),
		email_address: z.email({ message: t('validation.crmUser.emailAddressInvalid') }).min(1, { message: t('validation.crmUser.emailAddressRequired') }),
		dial_code: z.string({ message: t('validation.crmUser.dialCodeRequired') }),
		phone_no: z.string({ message: t('validation.crmUser.phoneNumberRequired') }).regex(/^\d{6,15}$/, { message: t('validation.crmUser.phoneNumberInvalid') }),
		role: z.enum(UserRoles, { message: t('validation.crmUser.roleRequired') }),
		is_active: z.boolean({ message: t('validation.crmUser.isActiveRequired') }),
	});
}
