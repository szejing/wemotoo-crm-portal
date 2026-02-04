import { defineStore } from 'pinia';
import type { ToastNotification } from '~/utils/types/event-notification';

// Grouped navigation structure for UDashboardGroup (labels are i18n keys)
const navigations = [
	// Main section
	{
		label: 'nav.main',
		links: [
			{
				label: 'nav.dashboard',
				icon: ICONS.DASHBOARD_ROUNDED,
				to: '/',
			},
			{
				label: 'nav.analytics',
				icon: ICONS.ANALYTICS,
				to: '/analytics',
			},
			{
				label: 'nav.appointments',
				icon: ICONS.CALENDAR,
				to: '/appointments',
			},
			{
				label: 'nav.orders',
				icon: ICONS.ORDER,
				to: '/orders',
			},
			{
				label: 'nav.products',
				icon: ICONS.PRODUCT,
				to: '/products',
				value: 'products',
				children: [
					{ label: 'nav.products', to: '/products/listing' },
					{ label: 'nav.categories', to: '/products/categories' },
					{ label: 'nav.brands', to: '/products/brands' },
					{ label: 'nav.tags', to: '/products/tags' },
					{ label: 'nav.options', to: '/products/options' },
				],
			},
			{
				label: 'nav.customers',
				icon: ICONS.CUSTOMER_GROUP_ROUNDED,
				to: '/customers',
			},
			{
				label: 'nav.staffs',
				icon: ICONS.USER_GROUP_ROUNDED,
				to: '/crm-users',
			},
			{
				label: 'nav.outlets',
				icon: ICONS.OUTLET,
				to: '/outlets',
			},
			{
				label: 'nav.payment',
				icon: ICONS.PAYMENT_METHODS,
				to: '/payment',
				value: 'payment',
				children: [
					{ label: 'nav.paymentMethods', to: '/payment/methods' },
					{ label: 'nav.paymentTypes', to: '/payment/types' },
				],
			},
			{
				label: 'nav.tax',
				icon: ICONS.TAX,
				to: '/taxes',
				value: 'taxes',
				children: [
					{ label: 'nav.taxCodes', to: '/taxes/codes' },
					{ label: 'nav.taxRules', to: '/taxes/rules' },
				],
			},
			{
				label: 'nav.settings',
				icon: ICONS.SETTINGS_ROUNDED,
				to: '/settings',
				value: 'settings',
				children: [
					{ label: 'nav.storeProfile', to: '/settings/store-profile' },
					{ label: 'nav.configuration', to: '/settings/configuration' },
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
