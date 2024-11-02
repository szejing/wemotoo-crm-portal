import { defineStore } from 'pinia';
import type { EventNotification } from '~/utils/types/event-notification';
import type { Navigation } from '~/utils/types/navigation.ts';

const merchantNavigation = [
	{
		title: 'Overview',
		icon: 'i-material-symbols-light-dashboard-outline-rounded',
		to: '/',
		isCollapsed: true,
	},
	{
		title: 'Orders',
		icon: 'i-material-symbols-light-order-approve-outline-rounded',
		to: '/orders',
		isCollapsed: true,
	},
	{
		title: 'Products',
		icon: 'i-material-symbols-light-box-add-outline-rounded',
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
		icon: 'i-material-symbols-light-groups-outline-rounded',
		to: '/customers',
		isCollapsed: true,
	},
	{
		title: 'Settings',
		icon: 'i-material-symbols-light-settings-outline-rounded',
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
					icon: 'i-material-symbols-close-rounded',
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
