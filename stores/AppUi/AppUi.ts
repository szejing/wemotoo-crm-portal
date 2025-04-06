import { defineStore } from 'pinia';
import type { EventNotification } from '~/utils/types/event-notification';
import type { Navigation } from '~/utils/types/navigation.ts';

const merchantNavigation = [
	{
		title: 'Overview',
		icon: ICONS.DASHBOARD_ROUNDED,
		to: '/',
		isCollapsed: false,
	},
	{
		title: 'Summ Order',
		icon: ICONS.ORDER_SUMMARY,
		to: '/order-summary',
		isCollapsed: false,
		children: [
			{
				title: 'Orders',
				to: '/order-summary/orders',
			},
			{
				title: 'Items',
				to: '/order-summary/order-items',
			},
			{
				title: 'Customers',
				to: '/order-summary/order-customers',
			},
		],
	},
	{
		title: 'Summ Sales',
		icon: ICONS.SALES_SUMMARY,
		to: '/sales-summary',
		isCollapsed: false,
		children: [
			{
				title: 'Sales',
				to: '/sales-summary/sales',
			},
			{
				title: 'Items',
				to: '/sales-summary/sales-items',
			},
			{
				title: 'Customers',
				to: '/sales-summary/sales-customers',
			},
		],
	},
	{
		title: 'Booking / Orders',
		icon: ICONS.ORDER,
		to: '/orders',
		isCollapsed: false,
	},
	{
		title: 'Products',
		icon: ICONS.PRODUCT,
		to: '/products',
		isCollapsed: false,
		children: [
			{
				title: 'Products',
				to: '/products',
			},
			{
				title: 'Options',
				to: '/products/options',
			},
			{
				title: 'Categories',
				to: '/products/categories',
			},
			{
				title: 'Tags',
				to: '/products/tags',
			},
		],
	},
	{
		title: 'Customers',
		icon: ICONS.CUSTOMER_GROUP_ROUNDED,
		to: '/customers',
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
