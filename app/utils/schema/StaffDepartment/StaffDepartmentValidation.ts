import { z } from 'zod';

type TranslateFn = (key: string) => string;

export function CreateStaffDepartmentValidation(t: TranslateFn) {
	return z.object({
		name: z.string().trim().min(1, t('validation.staffDepartment.nameRequired')).max(191, t('validation.staffDepartment.nameMax')),
		default_commission_rate: z.coerce.number().min(0, t('validation.staffDepartment.commissionMin')).max(100, t('validation.staffDepartment.commissionMax')),
		is_active: z.boolean(),
	});
}

export function UpdateStaffDepartmentValidation(t: TranslateFn) {
	return CreateStaffDepartmentValidation(t);
}
