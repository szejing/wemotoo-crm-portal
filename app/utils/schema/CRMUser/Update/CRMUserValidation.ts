import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';
import { UserRoles } from 'wemotoo-common';

export function UpdateCRMUserValidation(t: TranslateFn) {
	return z.object({
		name: z.string({ message: t('validation.crmUser.nameRequired') }),
		email_address: z.string({ message: t('validation.crmUser.emailAddressRequired') }),
		dial_code: z.string({ message: t('validation.crmUser.dialCodeRequired') }),
		phone_number: z.string({ message: t('validation.crmUser.phoneNumberRequired') }),
		role: z.enum(UserRoles, { message: t('validation.crmUser.roleRequired') }),
	});
}
