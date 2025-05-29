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
		title: 'Analytics',
		icon: ICONS.ANALYTICS,
		to: '/analytics',
		// isCollapsed: false,
		// children: [
		// 	// {
		// 	// 	title: 'Orders',
		// 	// 	to: '/analytics/orders',
		// 	// },
		// 	{
		// 		title: 'Sales',
		// 		to: '/analytics/sales',
		// 	},
		// 	// {
		// 	// 	title: 'Items',
		// 	// 	to: '/analytics/items',
		// 	// },
		// 	{
		// 		title: 'Payments',
		// 		to: '/analytics/sales/payments',
		// 	},
		// 	// {
		// 	// 	title: 'Customers',
		// 	// 	to: '/analytics/sales/customers',
		// 	// },
		// 	{
		// 		title: 'Items',
		// 		to: '/analytics/sales/items',
		// 	},
		// ],
	},
	// {
	// 	title: 'Sales Summary',
	// 	icon: ICONS.SALES_SUMMARY,
	// 	to: '/sales-summary',
	// 	isCollapsed: false,
	// 	children: [
	// 		{
	// 			title: 'Sales',
	// 			to: '/sales-summary/sales',
	// 		},
	// 		{
	// 			title: 'Items',
	// 			to: '/sales-summary/sales-items',
	// 		},
	// 		// {
	// 		// 	title: 'Customers',
	// 		// 	to: '/sales-summary/sales-customers',
	// 		// },
	// 	],
	// },
	{
		title: 'Booking / Orders',
		icon: ICONS.ORDER,
		to: '/orders',
		isCollapsed: false,
	},
	{
		title: 'Transactions',
		icon: ICONS.TRANSACTION,
		to: '/transactions',
		isCollapsed: false,
	},
	{
		title: 'Products',
		icon: ICONS.PRODUCT,
		to: '/products',
		isCollapsed: false,
		// children: [

		// ],
	},
	{
		title: 'Customers',
		icon: ICONS.CUSTOMER_GROUP_ROUNDED,
		to: '/customers',
		isCollapsed: false,
	},
	{
		title: 'Payment',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment',
		isCollapsed: false,
		// children: [
		// 	{
		// 		title: 'Payment Methods',
		// 		to: '/payment/methods',
		// 	},
		// 	{
		// 		title: 'Payment Type',
		// 		to: '/payment/types',
		// 	},
		// ],
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
		modal: undefined as EventNotification | undefined,
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

		addModal(notification: EventNotification) {
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

export const failedModal = (description: string, title?: string) => {
	const appUiStore = useAppUiStore();
	appUiStore.addModal({
		color: 'red',
		icon: ICONS.ERROR_OUTLINE,
		description,
		title,
	});
};
