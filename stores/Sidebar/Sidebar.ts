import { defineStore } from 'pinia';
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
				icon: 'i-material-symbols-light-box-add-outline-rounded',
				to: '/products',
			},
			{
				title: 'Categories',
				icon: 'i-material-symbols-light-box-add-outline-rounded',
				to: '/products/categories',
			},
			{
				title: 'Tags',
				icon: 'i-material-symbols-light-box-add-outline-rounded',
				to: '/products/tags',
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

export const useSidebarStore = defineStore({
	id: 'sidebarStore',
	state: () => ({
		forcedShow: true as boolean,
		showSidebar: true as boolean,
		showSidebarModal: false as boolean,
		navigations: merchantNavigation as Array<Navigation>,
	}),
	actions: {
		toggleSidebar() {
			this.showSidebar = !this.showSidebar;
		},

		toggleSidebarModal() {
			this.showSidebarModal = !this.showSidebarModal;
		},
	},
});
