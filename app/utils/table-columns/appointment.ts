import { h } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import { getFormattedDate, isSameDate } from 'wemotoo-common';
import { UBadge } from '#components';
import { getAppointmentStatusColor } from '~/utils/options';
import type { Appointment } from '~/utils/types/appointment';
import { getSortableHeader } from './sortable';

type TranslateFn = (key: string, params?: Record<string, number | string>) => string;

export function getAppointmentColumns(t: TranslateFn): TableColumn<Appointment>[] {
	return [
		{
			id: 'date_time',
			accessorFn: (row) => (row.start_date_time ? new Date(row.start_date_time).getTime() : 0),
			header: ({ column }) => getSortableHeader(column, t('table.dateTime')),
			cell: ({ row }) => {
				const start = row.original.start_date_time ? new Date(row.original.start_date_time) : null;
				const end = row.original.end_date_time ? new Date(row.original.end_date_time) : null;
				if (!start) return h('span', { class: 'text-neutral-400' }, '—');
				const dateLine = getFormattedDate(start, 'dd MMM yyyy');
				const timeLine =
					!end || isSameDate(start, end)
						? getFormattedDate(start, 'hh:mm aa') + (end ? ` - ${getFormattedDate(end, 'hh:mm aa')}` : '')
						: `${getFormattedDate(start, 'hh:mm aa')} - ${getFormattedDate(end, 'dd MMM yyyy, hh:mm aa')}`;
				return h('div', { class: 'flex flex-col gap-0.5' }, [
					h('span', { class: 'font-medium text-neutral-800 dark:text-neutral-100' }, dateLine),
					h('span', { class: 'text-sm text-neutral-500 dark:text-neutral-400' }, timeLine),
				]);
			},
		},
		{
			accessorKey: 'code',
			header: t('table.code'),
			cell: ({ row }) => h('span', { class: 'font-semibold text-neutral-800 dark:text-neutral-100' }, row.original.code),
		},
		{
			accessorKey: 'status',
			header: ({ column }) => getSortableHeader(column, t('table.status')),
			cell: ({ row }) => {
				const status = row.original.status;
				const color = getAppointmentStatusColor(status);
				const label = t('options.' + status.toLowerCase());
				return h(UBadge, { variant: 'subtle', color, size: 'sm' }, () => label);
			},
			meta: {
				class: {
					th: 'text-center',
					td: 'text-center',
				},
			},
		},
		{
			id: 'service',
			accessorKey: 'appt_desc',
			header: t('pages.service'),
			cell: ({ row }) =>
				h('p', { class: 'text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-[200px]' }, row.original.appt_desc || t('pages.noDescription')),
		},
		{
			id: 'customer',
			accessorFn: (row) => row.customer_name ?? '',
			header: t('table.customer'),
			cell: ({ row }) =>
				h('div', { class: 'flex flex-col gap-0.5' }, [
					h('p', { class: 'font-medium text-neutral-800 dark:text-neutral-100 truncate max-w-[180px]' }, row.original.customer_name),
					h('p', { class: 'text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-[180px]' }, row.original.customer_phone || '—'),
				]),
		},
		{
			accessorKey: 'duration',
			header: t('table.duration'),
			cell: ({ row }) => {
				const n = row.original.duration;
				if (n == null) return h('span', { class: 'text-neutral-400' }, '—');
				return h('span', { class: 'text-sm text-neutral-600 dark:text-neutral-400' }, t('pages.durationMinutes', { n }));
			},
			meta: {
				class: {
					th: 'text-center',
					td: 'text-center',
				},
			},
		},
	];
}
