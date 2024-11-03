import { defineStore } from 'pinia';
import type { EventNotification } from '~/utils/types/event-notification';
import type { Navigation } from '~/utils/types/navigation.ts';

const merchantNavigation = [
	{
		title: 'Overview',
		icon: ICONS.DASHBOARD_ROUNDED,
		to: '/',
		isCollapsed: true,
	},
	{
		title: 'Orders',
		icon: ICONS.ORDER,
		to: '/orders',
		isCollapsed: true,
	},
	{
		title: 'Products',
		icon: ICONS.PRODUCT,
		to: '/products',
		isCollapsed: true,
		children: [
			{
				title: 'Products',
				to: '/products',
			},
			{
				title: 'Categories',
				to: '/products/categories',
			},
			{
				title: 'Tags',
				to: '/products/tags',
			},
			{
				title: 'Options',
				to: '/products/options',
			},
		],
	},
	{
		title: 'Customers',
		icon: ICONS.CUSTOMER_GROUP_ROUNDED,
		to: '/customers',
		isCollapsed: true,
	},
	{
		title: 'Settings',
		icon: ICONS.SETTINGS_ROUNDED,
		to: '/settings',
		isCollapsed: true,
	},
];

export const useAppUiStore = defineStore({
	id: 'appUiStore',
	state: () => ({
		forcedShow: true as boolean,
		showSidebar: true as boolean,
		showSidebarModal: false as boolean,
		navigations: merchantNavigation as Array<Navigation>,
		notification: undefined as EventNotification | undefined,
	}),
	actions: {
		toggleSidebar() {
			this.showSidebar = !this.showSidebar;
		},

		toggleSidebarModal() {
			this.showSidebarModal = !this.showSidebarModal;
		},

		addNotification(notification: EventNotification) {
			this.notification = notification;

			if (this.notification.id === undefined) {
				this.notification.id = Date.now().toString();
			}

			if (this.notification.timeout === undefined) {
				this.notification.timeout = 3000;
			}

			if (this.notification.closeButton === undefined) {
				this.notification.closeButton = {
					icon: ICONS.CLOSE_ROUNDED,
					color: 'white',
					variant: 'link',
				};
			}
		},

		clearNotification() {
			this.notification = undefined;
		},
	},
});

export const successNotificateion = (description: string) => {
	const appUiStore = useAppUiStore();
	appUiStore.addNotification({
		color: 'green',
		icon: ICONS.CHECK_OUTLINE_ROUNDED,
		description,
	});
};

export const failedNotification = (description: string) => {
	const appUiStore = useAppUiStore();
	appUiStore.addNotification({
		color: 'red',
		icon: ICONS.ERROR_OUTLINE,
		description,
	});
};
