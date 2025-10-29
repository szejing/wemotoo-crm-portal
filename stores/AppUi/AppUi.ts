import { defineStore } from 'pinia';
import type { ToastNotification } from '~/utils/types/event-notification';
import type { Navigation } from '~/utils/types/navigation.ts';

const merchantNavigation = [
	{
		title: 'Overview',
		icon: ICONS.DASHBOARD_ROUNDED,
		to: '/',
		isCollapsed: false,
	},
	{
		title: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
	},
	{
		title: 'Appointments',
		icon: ICONS.CALENDAR,
		to: '/appointments',
		isCollapsed: false,
	},
	{
		title: 'Booking/Orders',
		icon: ICONS.ORDER,
		to: '/orders',
		isCollapsed: false,
	},
	{
		title: 'Services/Products',
		icon: ICONS.PRODUCT,
		to: '/products',
		isCollapsed: false,
	},
	{
		title: 'Customers',
		icon: ICONS.CUSTOMER_GROUP_ROUNDED,
		to: '/customers',
		isCollapsed: false,
	},
	{
		title: 'Outlets',
		icon: ICONS.OUTLET,
		to: '/outlets',
		isCollapsed: false,
	},
	{
		title: 'Payment',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment',
		isCollapsed: false,
	},
	{
		title: 'Tax',
		icon: ICONS.TAX,
		to: '/taxes',
		isCollapsed: false,
	},
	{
		title: 'Settings',
		icon: ICONS.SETTINGS_ROUNDED,
		to: '/settings',
		isCollapsed: false,
	},
];

export const useAppUiStore = defineStore('appUiStore', {
	state: () => ({
		forcedShow: true as boolean,
		showSidebar: true as boolean,
		showSidebarModal: false as boolean,
		navigations: merchantNavigation as Array<Navigation>,
		toastNotification: undefined as ToastNotification | undefined,
		modal: undefined as ToastNotification | undefined,
	}),
	actions: {
		toggleSidebar() {
			this.showSidebar = !this.showSidebar;
		},

		toggleSidebarModal() {
			this.showSidebarModal = !this.showSidebarModal;
		},

		showToast(notification: ToastNotification) {
			this.toastNotification = notification;

			if (this.toastNotification.id === undefined) {
				this.toastNotification.id = Date.now().toString();
			}

			if (this.toastNotification.timeout === undefined) {
				this.toastNotification.timeout = 3000;
			}

			if (this.toastNotification.closeButton === undefined) {
				this.toastNotification.closeButton = {
					icon: ICONS.CLOSE_ROUNDED,
					color: 'white',
					variant: 'link',
				};
			}
		},

		dismissToast() {
			this.toastNotification = undefined;
		},

		addModal(notification: ToastNotification) {
			this.modal = notification;

			if (this.modal.id === undefined) {
				this.modal.id = Date.now().toString();
			}

			if (this.modal.timeout === undefined) {
				this.modal.timeout = 3000;
			}

			if (this.modal.closeButton === undefined) {
				this.modal.closeButton = {
					icon: ICONS.CLOSE_ROUNDED,
					color: 'white',
					variant: 'link',
				};
			}
		},

		clearModal() {
			this.modal = undefined;
		},
	},
});

export const successNotification = (description: string) => {
	const appUiStore = useAppUiStore();
	appUiStore.showToast({
		color: 'success',
		icon: ICONS.CHECK_OUTLINE_ROUNDED,
		description,
	});
};

export const failedNotification = (description: string) => {
	const appUiStore = useAppUiStore();
	appUiStore.showToast({
		color: 'error',
		icon: ICONS.ERROR_OUTLINE,
		description,
	});
};

export const failedModal = (description: string, title?: string) => {
	const appUiStore = useAppUiStore();
	appUiStore.addModal({
		color: 'error',
		icon: ICONS.ERROR_OUTLINE,
		description,
		title,
	});
};
