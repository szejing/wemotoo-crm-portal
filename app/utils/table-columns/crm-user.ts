import type { ColumnDef } from '@tanstack/vue-table';
import type { CRMUser } from '~/utils/types/crm-user';
import { formatCrmUserPhone } from '../utils';
import { USwitch } from '#components';
import { useCRMUserStore } from '~/stores/CRMUser/CRMUser';
import { roleLabel } from '../options/user-roles';
import { getSortableHeader } from './sortable';

type TranslateFn = (key: string) => string;

type CrmUserColumnOptions = {
	hideStaffDepartment?: boolean;
};

export function getCrmUserColumns(t: TranslateFn, options?: CrmUserColumnOptions): ColumnDef<CRMUser>[] {
	const columns: ColumnDef<CRMUser>[] = [
		{
			accessorKey: 'row_index',
			header: t('table.noLabel'),
			cell: ({ row }) => {
				return h('div', { class: 'flex items-center gap-2' }, [h('p', { class: 'font-medium text-neutral-900 dark:text-neutral-100' }, String(row.index + 1))]);
			},
		},
		{
			accessorKey: 'name',
			header: ({ column }) => getSortableHeader(column, t('table.name')),
			cell: ({ row }) => {
				const u = row.original;
				const fullName = u.name || '—';
				return h('div', [h('div', { class: 'font-semibold text-neutral-900 dark:text-neutral-100' }, fullName), h('div', { class: 'text-sm text-neutral-600 dark:text-neutral-400' }, u.email_address)]);
			},
		},
		{
			accessorKey: 'phone_no',
			header: ({ column }) => getSortableHeader(column, t('table.phone')),
			cell: ({ row }) => {
				return h('p', { class: 'text-neutral-600 dark:text-neutral-400' }, formatCrmUserPhone(row.original));
			},
		},
		{
			accessorKey: 'role',
			header: ({ column }) => getSortableHeader(column, t('table.role')),
			cell: ({ row }) => {
				const label = roleLabel(row.original.role, t);
				return h(
					'span',
					{
						class: 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200',
					},
					label,
				);
			},
		},
	];

	if (!options?.hideStaffDepartment) {
		columns.push({
			accessorKey: 'staff_department_id',
			header: ({ column }) => getSortableHeader(column, t('table.staffDepartment')),
			cell: ({ row }) => {
				const department = row.original.staff_department;
				if (!department) {
					return h('span', { class: 'text-muted' }, '—');
				}
				return h('div', [h('div', { class: 'font-medium text-neutral-900 dark:text-neutral-100' }, department.name), h('div', { class: 'text-xs text-neutral-600 dark:text-neutral-400' }, `${department.default_commission_rate}%`)]);
			},
		});
	}

	columns.push({
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
						class: 'size-5',
						modelValue: row.original.is_active,
						disabled: false,
						'onUpdate:modelValue': (value: unknown) => crmUserStore.updateStatus(row.original, Boolean(value)),
					}),
				],
			);
		},
	});

	return columns;
}
