import type { TableColumn } from '@nuxt/ui';
import type { NotificationDisplayRow } from '~/utils/types/notification';
import { headerCell } from './styles';

type TranslateFn = (key: string) => string;

export function getNotificationColumns(t: TranslateFn): TableColumn<NotificationDisplayRow>[] {
	return [
		{
			accessorKey: 'ref_no',
			header: () => headerCell(t('notifications.reference')),
		},
		{
			id: 'description',
			accessorKey: 'description',
			header: () => headerCell(t('notifications.description')),
		},
		{
			accessorKey: 'lastUpdated',
			header: () => headerCell(t('table.lastUpdated')),
			meta: {
				class: {
					th: 'hidden lg:table-cell',
					td: 'hidden lg:table-cell',
				},
			},
		},
	];
}
