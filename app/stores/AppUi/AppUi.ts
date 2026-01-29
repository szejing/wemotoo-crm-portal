import { defineStore } from 'pinia';
import type { ToastNotification } from '~/utils/types/event-notification';

// Grouped navigation structure for UDashboardGroup
const navigations = [
	// Main section
	{
		label: 'Main',
		links: [
			{
				label: 'Dashboard',
				icon: ICONS.DASHBOARD_ROUNDED,
				to: '/',
			},
			{
				label: 'Analytics',
				icon: ICONS.ANALYTICS,
				to: '/analytics',
			},
			{
				label: 'Appointments',
				icon: ICONS.CALENDAR,
				to: '/appointments',
			},
			{
				label: 'Orders',
				icon: ICONS.ORDER,
				to: '/orders',
			},
			{
				label: 'Products',
				icon: ICONS.PRODUCT,
				to: '/products',
				value: 'products',
				children: [
					{
						label: 'Products',
						to: '/products/listing',
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
			{
				label: 'Users',
				icon: ICONS.USER_GROUP_ROUNDED,
				to: '/crm-users',
			},
			{
				label: 'Outlets',
				icon: ICONS.OUTLET,
				to: '/outlets',
			},
			{
				label: 'Payment',
				icon: ICONS.PAYMENT_METHODS,
				to: '/payment',
				value: 'payment',
				children: [
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
				value: 'taxes',
				children: [
					{
						label: 'Tax Codes',
						to: '/taxes/codes',
					},
					{
						label: 'Tax Rules',
						to: '/taxes/rules',
					},
				],
			},
			{
				label: 'Settings',
				icon: ICONS.SETTINGS_ROUNDED,
				to: '/settings',
				value: 'settings',
				children: [
					{
						label: 'Store Profile',
						to: '/settings/store-profile',
					},
					{
						label: 'Configuration',
						to: '/settings/configuration',
					},
				],
			},
		],
	},
];

export const useAppUiStore = defineStore('appUiStore', {
	state: () => ({
		forcedShow: true as boolean,
		showSidebar: false as boolean,
		navigations: navigations,
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
