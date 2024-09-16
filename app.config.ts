/* eslint-disable @stylistic/quotes */
import { theme } from '~/theme';

export default defineAppConfig({
	// title: 'HeroesTech Solutions',
	// tagline: 'A modern web development company',
	// address: 'Floor D 20-08, Menara Mitraland 13A, Jalan PJU 5/1, Kota Damansara, 47810 Petaling Jaya',
	theme,
	ui: {
		strategy: 'override',
		primary: theme.main,
		gray: theme.gray,

		//* Notification *//
		notifications: {
			// Show toasts at the top right of the screen
			position: 'top-0 right-0 bottom-auto left-auto',
		},

		notification: {
			default: {
				closeButton: {
					icon: 'i-octicon-x-24',
				},
			},
		},

		//* Card *//
		card: {
			base: 'transition duration-200 py-2',
			shadow: 'shadow-md',
			divide: 'divide-none',
			rounded: `rounded`,
			header: {
				base: '',
				background: '',
				padding: 'px-4 py-2',
			},
			body: {
				base: '',
				background: '',
				padding: 'px-4 py-3',
			},
			footer: {
				base: '',
				background: '',
				padding: 'px-4 pt-2 pb-2',
			},
		},

		//* Button *//
		button: {
			base: 'transition duration-200',
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
					solid: 'button-primary-solid disabled:button-primary-solid-disabled',
					outline: 'button-primary-outline disabled:button-primary-outline-disabled',
				},
				green: {
					solid: 'button-green-solid',
					outline: 'button-green-outline disabled:button-green-outline-disabled',
				},
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

		//* Badge *//
		badge: {
			rounded: 'rounded',
		},

		// * FormGroup *//
		formGroup: {
			wrapper: '',
			inner: '',
			label: {
				wrapper: 'flex content-center items-center justify-between',
				base: 'block font-normal text-neutral-400',
				required: "after:content-['*'] after:ms-0.5 after:text-red-500",
			},
			size: {
				'2xs': 'text-xs md:text-xs',
				'xs': 'text-xs md:text-xs',
				'sm': 'text-sm md:text-sm',
				'md': 'text-sm md:text-base',
				'lg': 'text-sm md:text-xl',
				'xl': 'text-sm md:text-2xl',
			},
			container: 'mt-1 relative',
			description: 'text-gray-500',
			hint: 'text-gray-500',
			help: 'mt-2 text-gray-500',
			error: 'mt-2 text-red-500',
			default: {
				size: 'sm',
			},
		},

		//* Input *//
		input: {
			size: {
				'2xs': 'text-xs md:text-xs',
				'xs': 'text-xs md:text-xs',
				'sm': 'text-sm md:text-sm',
				'md': 'text-sm md:text-base',
				'lg': 'text-sm md:text-xl',
				'xl': 'text-sm md:text-2xl',
			},
			padding: {
				'2xs': 'px-2 py-1',
				'xs': 'px-2 py-1',
				'sm': 'px-2 py-1',
				'md': 'px-4 py-2',
				'lg': 'px-4 py-2',
				'xl': 'px-4 py-3',
			},
			leading: {
				padding: {
					'2xs': 'ps-8',
					'xs': 'ps-9',
					'sm': 'ps-10',
					'md': 'ps-11',
					'lg': 'ps-12',
					'xl': 'ps-13',
				},
			},
			trailing: {
				padding: {
					'2xs': 'pe-8',
					'xs': 'pe-9',
					'sm': 'pe-10',
					'md': 'pe-11',
					'lg': 'pe-12',
					'xl': 'pe-13',
				},
			},
			default: {
				size: 'md',
				loadingIcon: 'material-symbols:sync-rounded',
			},
			rounded: `rounded`,
		},

		//* Textarea *//
		textarea: {
			rounded: 'rounded',
		},

		//* Select *//
		select: {
			rounded: 'rounded',
			size: {
				'2xs': 'text-xs md:text-xs',
				'xs': 'text-xs md:text-xs',
				'sm': 'text-sm md:text-sm',
				'md': 'text-sm md:text-base',
				'lg': 'text-sm md:text-xl',
				'xl': 'text-sm md:text-2xl',
			},
			padding: {
				'2xs': 'px-2 py-1',
				'xs': 'px-2 py-1',
				'sm': 'px-2 py-1',
				'md': 'px-4 py-2',
				'lg': 'px-4 py-2',
				'xl': 'px-4 py-3',
			},
			default: {
				loadingIcon: 'material-symbols:sync-rounded',
				trailingIcon: 'material-symbols:expand-more-rounded',
			},
		},

		//* Select Menu *//
		selectMenu: {
			rounded: 'rounded',
			padding: 'px-4 py-2',
			default: {
				selectedIcon: 'material-symbols:fitbit-check-small-rounded',
			},
		},

		//* Command Palette *//
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

		//* Table *//
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

		//* Avatar *//
		avatar: {
			default: {},
			rounded: 'rounded',
		},

		//* Breadcrumb *//
		breadcrumb: {
			li: 'flex items-center gap-x-1.5 text-secondary-200  text-sm leading-6 min-w-0',
			base: 'flex items-center gap-x-1.5 group font-light min-w-0',
			active: 'text-secondary-800 font-medium',
			inactive: 'hover:text-secondary-500',
			default: {
				divider: 'i-material-symbols-light-chevron-right',
			},
		},

		//* Pagination *//
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
