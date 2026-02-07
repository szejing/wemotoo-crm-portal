import { UserRoles } from 'wemotoo-common';
import type { TranslateFn } from './schema/Auth/LoginValidation';

const roleLabels: Record<string, string> = {
	[UserRoles.SUPER_ADMIN]: 'Super Admin',
	[UserRoles.SUPER_STAFF]: 'Super Staff',
	[UserRoles.MERCHANT_ADMIN]: 'Merchant Admin',
	[UserRoles.MERCHANT_STAFF]: 'Merchant Staff',
};
export const MerchantRoles = [UserRoles.MERCHANT_ADMIN, UserRoles.MERCHANT_STAFF];

export const roleLabel = (role: UserRoles, t: TranslateFn): string => {
	return t(roleLabels[role] || String(role));
};

export const roleOptions = (t: TranslateFn) => Object.values(MerchantRoles).map((role) => ({ label: roleLabel(role, t), value: role }));
