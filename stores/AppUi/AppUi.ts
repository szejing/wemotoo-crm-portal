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
		title: 'Booking / Orders',
		icon: ICONS.ORDER,
		to: '/orders',
		isCollapsed: true,
	},
	{
		title: 'Categories',
		icon: ICONS.CATEGORY,
		to: '/categories',
		isCollapsed: true,
	},
	{
		title: 'Tags',
		icon: ICONS.TAG,
		to: '/tags',
		isCollapsed: true,
	},
	{
		title: 'Maintenance',
		icon: ICONS.MAINTENANCE_SERVICE,
		to: '/maintenance-services',
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

export const useAppUiStore = defineStore('appUiStore', {
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

export const successNotification = (description: string) => {
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
