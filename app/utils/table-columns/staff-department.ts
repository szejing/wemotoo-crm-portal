/* eslint-disable indent */
import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { getFormattedDate } from 'yeppi-common';
import { USwitch } from '#components';
import type { StaffDepartment } from '~/utils/types/staff-department';
import { useStaffDepartmentStore } from '~/stores/StaffDepartment/StaffDepartment';
import { headerCell, mutedCell, tableCellMeta } from './styles';

type TranslateFn = (key: string) => string;

export function getStaffDepartmentColumns(t: TranslateFn): TableColumn<StaffDepartment>[] {
	return [
		{
			id: 'name',
			accessorKey: 'name',
			header: () => headerCell(t('common.name')),
			cell: ({ row }) => {
				const name = row.original.name?.trim() ?? '';
				return h('span', { class: 'min-w-0 font-medium' }, name);
			},
		},
		{
			id: 'default_commission_rate',
			accessorKey: 'default_commission_rate',
			header: () => headerCell(t('components.crmUserForm.defaultCommissionRate'), 'right'),
			cell: ({ row }) => {
				const rate = Number(row.original.default_commission_rate ?? 0);
				return h('span', { class: 'text-sm text-muted tabular-nums' }, `${rate}%`);
			},
			...tableCellMeta.rightNumeric,
		},
		{
			accessorKey: 'is_active',
			header: () => headerCell(t('common.status')),
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
			header: () => headerCell(t('table.lastUpdated')),
			cell: ({ row }) => {
				if (!row.original.updated_at) {
					return mutedCell('—');
				}
				const dateStr = getFormattedDate(new Date(row.original.updated_at), 'dd/MM/yyyy');
				return h('span', { class: 'text-sm text-muted tabular-nums' }, dateStr);
			},
		},
	];
}
