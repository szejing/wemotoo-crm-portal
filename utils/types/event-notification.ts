export type EventNotification = {
	color: 'green' | 'red' | 'orange';
	icon?: string | undefined;
	id?: string | undefined;
	title?: string | undefined;
	description?: string | undefined;
	timeout?: number | undefined;
	actions?: [] | undefined;
};
