import { z } from 'zod';
import { UserRoles } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

export function CreateCRMUserValidation(t: TranslateFn) {
	return z.object({
		name: z.string({ message: t('validation.crmUser.nameRequired') }),
		email_address: z.string({ message: t('validation.crmUser.emailAddressRequired') }),
		dial_code: z.string({ message: t('validation.crmUser.dialCodeRequired') }),
		phone_number: z.string({ message: t('validation.crmUser.phoneNumberRequired') }),
		role: z.enum(UserRoles, { message: t('validation.crmUser.roleRequired') }),
	});
}
