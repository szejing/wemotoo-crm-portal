import { defineStore } from 'pinia';
import type { ToastNotification } from '~/utils/types/event-notification';
import type { Navigation } from '~/utils/types/navigation.ts';

// Grouped navigation structure for UDashboardGroup
const merchantNavigationGrouped = [
	// Main section
	{
		label: 'Main',
		links: [
			{
				label: 'Overview',
				icon: ICONS.DASHBOARD_ROUNDED,
				to: '/',
			},
			{
				label: 'Analytics',
				icon: ICONS.ANALYTICS,
				to: '/analytics',
			},
		],
	},
	// Business Operations section
	{
		label: 'Business Operations',
		links: [
			{
				label: 'Appointments',
				icon: ICONS.CALENDAR,
				to: '/appointments',
			},
			{
				label: 'Booking/Orders',
				icon: ICONS.ORDER,
				to: '/orders',
			},
			{
				label: 'Services/Products',
				icon: ICONS.PRODUCT,
				to: '/products',
				children: [
					{
						label: 'All Products',
						to: '/products',
					},
					{
						label: 'Categories',
						to: '/products/categories',
					},
					{
						label: 'Brands',
						to: '/products/brands',
					},
					{
						label: 'Tags',
						to: '/products/tags',
					},
					{
						label: 'Options',
						to: '/products/options',
					},
				],
			},
			{
				label: 'Customers',
				icon: ICONS.CUSTOMER_GROUP_ROUNDED,
				to: '/customers',
			},
		],
	},
	// Configuration section
	{
		label: 'Configuration',
		links: [
			{
				label: 'Outlets',
				icon: ICONS.OUTLET,
				to: '/outlets',
			},
			{
				label: 'Payment',
				icon: ICONS.PAYMENT_METHODS,
				to: '/payment',
				children: [
					{
						label: 'Overview',
						to: '/payment',
					},
					{
						label: 'Payment Methods',
						to: '/payment/methods',
					},
					{
						label: 'Payment Types',
						to: '/payment/types',
					},
				],
			},
			{
				label: 'Tax',
				icon: ICONS.TAX,
				to: '/taxes',
				children: [
					{
						label: 'Overview',
						to: '/taxes',
					},
					{
						label: 'Tax Codes',
						to: '/taxes/codes',
					},
					{
						label: 'Tax Groups',
						to: '/taxes/groups',
					},
				],
			},
			{
				label: 'Settings',
				icon: ICONS.SETTINGS_ROUNDED,
				to: '/settings',
			},
		],
	},
];

// Flat navigation (legacy - kept for backward compatibility)
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
		showSidebar: false as boolean,
		navigations: merchantNavigation as Array<Navigation>,
		navigationGroups: merchantNavigationGrouped,
		toastNotification: undefined as ToastNotification | undefined,
		modal: undefined as ToastNotification | undefined,
	}),
	actions: {
		toggleSidebar() {
			this.showSidebar = !this.showSidebar;
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
