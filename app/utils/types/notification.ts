import type { NotificationSeverity, NotificationType } from 'wemotoo-common';

export type NotificationAction = {
	label: string;
	url: string;
};

export type NotificationItem = {
	id: string;
	title: string;
	subtitle?: string;
	ref_no?: string;
	status?: string;
	scheduled_at?: string | Date;
	created_at?: string | Date;
	updated_at?: string | Date;
	read_at?: string;
	opened_at?: string;
	notification_type?: NotificationType;
	notification_title?: string;
	notification_description?: string;
	notification_severity?: NotificationSeverity;
	action: NotificationAction;
};

export type Notification = {
	type: NotificationType;
	title: string;
	description: string;
	severity: NotificationSeverity;
	count: number;
	action: NotificationAction;
	items: NotificationItem[];
};

export type NotificationCenter = {
	generated_at: string | Date;
	total_count: number;
	notifications: Notification[];
	handled_scenarios: NotificationType[];
};
