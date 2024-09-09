import { theme } from '~/theme';

export default defineAppConfig({
	// title: 'HeroesTech Solutions',
	// tagline: 'A modern web development company',
	// address: 'Floor D 20-08, Menara Mitraland 13A, Jalan PJU 5/1, Kota Damansara, 47810 Petaling Jaya',
	theme,
	ui: {
		strategy: 'override',
		primary: theme.primary,
		gray: theme.gray,
		notifications: {
			// Show toasts at the top right of the screen
			position: 'top-0 right-0 bottom-auto left-auto',
		},
		card: {
			base: 'transition duration-200',
			shadow: 'shadow-none',
			body: {
				base: 'h-full flex flex-col',
			},
			rounded: `rounded`,
		},

		button: {
			base: 'button',
			// base: 'hover:scale-105 active:hover:scale-95 transition duration-150',
			font: 'font-bold font-nunito',
			rounded: 'rounded',
			default: {
				loadingIcon: 'material-symbols:sync-rounded',
			},
			size: {
				'2xs': 'text-xs md:text-xs',
				'xs': 'text-xs md:text-xs',
				'sm': 'text-sm md:text-sm',
				'md': 'text-sm md:text-base',
				'lg': 'text-sm md:text-xl',
				'xl': 'text-sm md:text-2xl',
			},
			color: {
				primary: {
					solid:
						'ring-1 ring-inset ring-primary text-white hover:button-hover disabled:bg-white bg-primary dark:hover:button-hover dark:disabled:bg-secondary-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400',
					outline:
						'ring-1 ring-inset ring-secondary-800 dark:ring-white text-secondary-800 dark:text-white hover:text-white hover:button-hover disabled:bg-transparent dark:hover:button-hover dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary',
				},
			},
			variant: {
				outline:
					'ring-1 ring-inset ring-current text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400',
			},
			padding: {
				'2xs': 'px-2 py-1',
				'xs': 'px-2.5 py-1.5',
				'sm': 'px-2.5 py-1.5',
				'md': 'px-3 py-2',
				'lg': 'px-5 py-3',
				'xl': 'px-10 py-3',
			},
		},
		badge: {
			rounded: 'rounded',
		},
		input: {
			default: {
				loadingIcon: 'material-symbols:sync-rounded',
			},
			rounded: `rounded-${theme.borderRadius}`,
		},
		select: {
			rounded: 'rounded',
			default: {
				loadingIcon: 'material-symbols:sync-rounded',
				trailingIcon: 'material-symbols:expand-more-rounded',
			},
		},
		textarea: {
			rounded: 'rounded',
		},
		selectMenu: {
			rounded: 'rounded',
			default: {
				selectedIcon: 'material-symbols:fitbit-check-small-rounded',
			},
		},
		notification: {
			default: {
				closeButton: {
					icon: 'i-octicon-x-24',
				},
			},
		},
		commandPalette: {
			default: {
				icon: 'material-symbols:search-rounded',
				loadingIcon: 'material-symbols:sync-rounded',
				selectedIcon: 'material-symbols:fitbit-check-small-rounded',
				emptyState: {
					icon: 'material-symbols:search-rounded',
				},
			},
		},
		table: {
			default: {
				sortAscIcon: 'octicon:sort-asc-24',
				sortDescIcon: 'octicon:sort-desc-24',
				// sortButton: {
				// 	icon: 'octicon-arrow-switch-24',
				// },
				loadingState: {
					icon: 'material-symbols:sync-rounded',
				},
				emptyState: {
					icon: 'material-symbols:database-outline',
				},
			},
		},
		avatar: {
			default: {},
			rounded: 'rounded',
		},
		breadcrumb: {
			default: {
				divider: 'material-symbols:chevron-right',
			},
		},
		pagination: {
			rounded: 'first:rounded-l-button last:rounded-r-button',
			default: {
				prevButton: {
					icon: 'material-symbols:arrow-back-rounded',
				},
				nextButton: {
					icon: 'material-symbols:arrow-forward-rounded',
				},
			},
		},
	},
});
