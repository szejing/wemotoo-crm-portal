import type {
	Notification,
	NotificationCenter,
	NotificationItem,
} from '~/utils/types/notification';
import type { BaseODataResp } from '~/repository/base/base.resp';

export type NotificationResp = BaseODataResp<Notification> &
	Pick<NotificationCenter, 'generated_at' | 'total_count' | 'handled_scenarios'>;
export type NotificationItemResp = NotificationItem;
