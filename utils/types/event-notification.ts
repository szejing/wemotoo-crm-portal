export type EventNotification = {
	color: 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral';
	icon?: string | undefined;
	id?: string | undefined;
	title?: string | undefined;
	description?: string | undefined;
	timeout?: number | undefined;
	actions?: [] | undefined;
	closeButton?: object | undefined;
};
