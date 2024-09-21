export type Navigation = {
	title: string;
	icon: string;
	to: string;
	isCollapsed: boolean;
	children: Navigation[];
};
