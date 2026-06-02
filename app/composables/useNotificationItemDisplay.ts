import { format } from 'date-fns';
import type { NotificationItem } from '~/utils/types/notification';

export const useNotificationItemDisplay = () => {
	const formatDateTime = (date?: string | Date) => {
		if (!date) {
			return '-';
		}

		return format(new Date(date), 'dd MMM, h:mm a');
	};

	const formatItemMeta = (item: NotificationItem) => {
		const date = item.scheduled_at ?? item.updated_at ?? item.created_at;
		const parts = [item.status, item.ref_no].filter((part): part is string => !!part);

		if (date) {
			parts.push(formatDateTime(date));
		}

		return parts.join(' · ');
	};

	const getSummaryLines = (item: NotificationItem) => {
		return item.summary_lines?.length
			? item.summary_lines
			: [item.subtitle].filter((line): line is string => !!line);
	};

	return {
		formatDateTime,
		formatItemMeta,
		getSummaryLines,
	};
};
