import { defineStore } from 'pinia';

const merchantNavigation = [
	{
		title: 'Overview',
		icon: 'i-material-symbols-light-dashboard-outline-rounded',
		to: '/',
	},
	{
		title: 'Orders',
		icon: 'i-material-symbols-light-order-approve-outline-rounded',
		to: '/orders',
	},
	{
		title: 'Products',
		icon: 'i-material-symbols-light-box-add-outline-rounded',
		to: '/products',
	},
	{
		title: 'Customers',
		icon: 'i-material-symbols-light-groups-outline-rounded',
		to: '/customers',
	},
	{
		title: 'Settings',
		icon: 'i-material-symbols-light-settings-outline-rounded',
		to: '/settings',
	},
];

export const useSidebarStore = defineStore({
	id: 'sidebarStore',
	state: () => ({
		forcedShow: true as boolean,
		showSidebar: true as boolean,
		navigations: merchantNavigation as Array<{ title: string; icon: string; to: string }>,
	}),
	actions: {
		toggleSidebar() {
			this.showSidebar = !this.showSidebar;
		},
	},
});
