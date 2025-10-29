export type ToastNotification = {
	color: 'success' | 'error' | 'warning';
	icon?: string | undefined;
	id?: string | undefined;
	title?: string | undefined;
	description?: string | undefined;
	timeout?: number | undefined;
	actions?: [] | undefined;
	closeButton?: object | undefined;
};
