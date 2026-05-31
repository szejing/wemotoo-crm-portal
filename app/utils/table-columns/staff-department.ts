/* eslint-disable indent */
import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { getFormattedDate } from 'wemotoo-common';
import { USwitch } from '#components';
import type { StaffDepartment } from '~/utils/types/staff-department';
import { useStaffDepartmentStore } from '~/stores/StaffDepartment/StaffDepartment';

type TranslateFn = (key: string) => string;

export function getStaffDepartmentColumns(t: TranslateFn): TableColumn<StaffDepartment>[] {
	return [
		{
			id: 'name',
			accessorKey: 'name',
			header: t('common.name'),
			cell: ({ row }) => {
				const name = row.original.name?.trim() ?? '';
				return h('span', { class: 'min-w-0 font-medium' }, name);
			},
		},
		{
			id: 'default_commission_rate',
			accessorKey: 'default_commission_rate',
			header: t('components.crmUserForm.defaultCommissionRate'),
			cell: ({ row }) => {
				const rate = Number(row.original.default_commission_rate ?? 0);
				return h('span', { class: 'tabular-nums text-muted' }, `${rate}%`);
			},
		},
		{
			accessorKey: 'is_active',
			header: t('common.status'),
			cell: ({ row }) => {
				const staffDepartmentStore = useStaffDepartmentStore();
				return h(
					'div',
					{
						class: 'flex items-center gap-2 leading-none',
						onClick: (e: Event) => e.stopPropagation(),
					},
					[
						h(USwitch, {
							'class': 'size-4 cursor-pointer',
							'modelValue': row.original.is_active,
							'disabled': false,
							'onUpdate:modelValue': (value: unknown) => {
								void staffDepartmentStore.updateStatus(row.original, value === true);
							},
						}),
					],
				);
			},
		},
		{
			accessorKey: 'updated_at',
			header: t('table.lastUpdated'),
			cell: ({ row }) => {
				if (!row.original.updated_at) {
					return h('span', { class: 'text-muted text-xs' }, '—');
				}
				const dateStr = getFormattedDate(new Date(row.original.updated_at), 'dd/MM/yyyy');
				return h('span', { class: 'text-sm text-muted tabular-nums' }, dateStr);
			},
		},
	];
}
