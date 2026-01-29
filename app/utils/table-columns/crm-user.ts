import type { ColumnDef } from '@tanstack/vue-table';
import type { CRMUser } from '~/utils/types/crm-user';
import { UserRoles } from 'wemotoo-common';
import { formatCrmUserPhone } from '../utils';

function roleLabel(role: UserRoles): string {
	const labels: Record<UserRoles, string> = {
		[UserRoles.SUPER_ADMIN]: 'Super Admin',
		[UserRoles.SUPER_STAFF]: 'Super Staff',
		[UserRoles.MERCHANT_ADMIN]: 'Merchant Admin',
		[UserRoles.MERCHANT_STAFF]: 'Merchant Staff',
		[UserRoles.CUSTOMER]: 'Customer',
	};
	return labels[role] ?? role;
}

export const crm_user_columns: ColumnDef<CRMUser>[] = [
	{
		accessorKey: 'row_index',
		header: 'No',
		cell: ({ row }) => {
			return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900 dark:text-neutral-100' }, String(row.index + 1))]);
		},
	},
	{
		accessorKey: 'name',
		header: 'Name',
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
		accessorKey: 'email_address',
		header: 'Email',
		cell: ({ row }) => {
			return h('p', { class: 'text-neutral-700 dark:text-neutral-300' }, row.original.email_address);
		},
	},
	{
		accessorKey: 'phone_no',
		header: 'Phone',
		cell: ({ row }) => {
			return h('p', { class: 'text-neutral-600 dark:text-neutral-400' }, formatCrmUserPhone(row.original));
		},
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }) => {
			const label = roleLabel(row.original.role);
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
];
