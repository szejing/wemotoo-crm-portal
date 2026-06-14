import type { NotificationItem } from '~/utils/types/notification';

type NotificationDescriptionItem = Pick<NotificationItem, 'summary_lines' | 'subtitle' | 'notification_description' | 'title'>;
type NotificationReferenceItem = Pick<NotificationItem, 'order_no' | 'ref_no' | 'title'>;

export const getNotificationDisplayDescription = (item: NotificationDescriptionItem): string => {
	if (item.notification_description) {
		return item.notification_description;
	}

	const summary = item.summary_lines?.filter((line) => !/^(Status|Payment):/i.test(line.trim())) ?? [];

	if (summary.length > 0) {
		return summary.join(' · ');
	}

	return item.subtitle ?? item.notification_description ?? item.title;
};

export const getNotificationDisplayReferenceId = (item: NotificationReferenceItem): string => {
	const titleOrderId = item.title.match(/#([A-Z0-9-]+)/i)?.[1];

	return item.order_no || titleOrderId || item.ref_no || '-';
};
