import type { ColumnDef } from '@tanstack/vue-table';
import type { CRMUser } from '~/utils/types/crm-user';
import { formatCrmUserPhone } from '../utils';
import { USwitch } from '#components';
import { useCRMUserStore } from '~/stores/CRMUser/CRMUser';
import { roleLabel } from '../options/user-roles';

type TranslateFn = (key: string) => string;

// function roleLabel(role: UserRoles, t: TranslateFn): string {
// 	const keyMap: Record<UserRoles, string> = {
// 		[UserRoles.SUPER_ADMIN]: 'components.crmUserForm.roleSuperAdmin',
// 		[UserRoles.SUPER_STAFF]: 'components.crmUserForm.roleSuperStaff',
// 		[UserRoles.MERCHANT_ADMIN]: 'components.crmUserForm.roleMerchantAdmin',
// 		[UserRoles.MERCHANT_STAFF]: 'components.crmUserForm.roleMerchantStaff',
// 		[UserRoles.CUSTOMER]: 'table.customer',
// 	};
// 	return keyMap[role] ? t(keyMap[role]) : role;
// }

export function getCrmUserColumns(t: TranslateFn): ColumnDef<CRMUser>[] {
	return [
		{
			accessorKey: 'row_index',
			header: t('table.noLabel'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900 dark:text-neutral-100' }, String(row.index + 1))]);
			},
		},
		{
			accessorKey: 'name',
			header: t('table.name'),
			cell: ({ row }) => {
				const u = row.original;
				const fullName = u.name || '—';
				return h('div', [
					h('div', { class: 'font-semibold text-neutral-900 dark:text-neutral-100' }, fullName),
					h('div', { class: 'text-sm text-neutral-600 dark:text-neutral-400' }, u.email_address),
				]);
			},
		},
		{
			accessorKey: 'phone_no',
			header: t('table.phone'),
			cell: ({ row }) => {
				return h('p', { class: 'text-neutral-600 dark:text-neutral-400' }, formatCrmUserPhone(row.original));
			},
		},
		{
			accessorKey: 'role',
			header: t('table.role'),
			cell: ({ row }) => {
				const label = roleLabel(row.original.role, t);
				return h(
					'span',
					{
						class:
							'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200',
					},
					label,
				);
			},
		},
		{
			accessorKey: 'is_active',
			header: () => h('div', { class: 'text-center' }, t('table.active')),
			cell: ({ row }) => {
				const crmUserStore = useCRMUserStore();
				return h(
					'div',
					{
						class: 'flex justify-center',
						onClick: (e: Event) => e.stopPropagation(),
					},
					[
						h(USwitch, {
							'class': 'size-5',
							'modelValue': row.original.is_active,
							'disabled': false,
							'onUpdate:modelValue': (value: boolean) => crmUserStore.updateStatus(row.original, value),
						}),
					],
				);
			},
		},
	];
}
