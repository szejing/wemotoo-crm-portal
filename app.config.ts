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

		//* Modal *//
		modal: {
			width: 'w-full max-w-[90%] sm:max-w-[60%]',
		},
		//* Notification *//
		notifications: {
			position: 'bottom-0 right-0 top-auto left-auto',
		},

		notification: {
			background: 'bg-{color}-500',
			title: 'text-sm font-medium text-neutral',
			description: 'mt-1 text-sm leading-4 text-neutral',
			icon: {
				color: 'text-neutral',
			},
			progress: {
				background: 'bg-neutral',
			},
		},

		//* Card *//
		card: {
			base: 'transition duration-200 py-2',
			background: 'bg-neutral',
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
			font: 'font-bold',
			rounded: 'rounded',
			default: {
				loadingIcon: 'i-material-symbols-sync-rounded',
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
				danger: {
					solid: 'button-red-solid',
					outline: 'button-red-outline disabled:button-red-outline-disabled',
				},
				neutral: {
					solid: 'button-neutral-solid',
					ghost: 'button-neutral-ghost',
					soft: 'button-neutral-soft',
					link: 'button-neutral-link',
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

		checkbox: {
			container: 'flex items-center h-6',
			base: 'h-5 w-5 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent',
			label: 'text-base font-medium text-neutral-700',
			required: 'text-base text-red-500 ',
			help: 'text-base text-neutral-500 ',
		},

		// * FormGroup *//
		formGroup: {
			wrapper: '',
			inner: '',
			label: {
				wrapper: 'flex content-center items-center justify-between',
				base: 'block font-normal text-secondary-700',
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
			description: 'text-neutral-500',
			hint: 'text-neutral-500',
			help: 'mt-2 text-neutral-500',
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
				'md': 'text-sm md:text-md',
				'lg': 'text-base md:text-xl',
				'xl': 'text-base md:text-2xl',
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
				loadingIcon: 'i-material-symbols-sync-rounded',
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
			placeholder: 'text-neutral-400',
			default: {
				loadingIcon: 'i-material-symbols-sync-rounded',
				trailingIcon: 'i-material-symbols-expand-more-rounded',
			},
		},

		//* Select Menu *//
		selectMenu: {
			rounded: 'rounded',
			padding: 'px-2 py-2',
			option: {
				padding: 'px-4 py-1.5',
			},
			placeholder: 'text-neutral-400',
			default: {
				selectedIcon: 'i-material-symbols-fitbit-check-small-rounded',
			},
		},

		//* Command Palette *//
		commandPalette: {
			default: {
				icon: 'i-material-symbols-search-rounded',
				loadingIcon: 'i-material-symbols-sync-rounded',
				selectedIcon: 'i-material-symbols-fitbit-check-small-rounded',
				emptyState: {
					icon: 'i-material-symbols-search-rounded',
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
					icon: 'i-material-symbols-sync-rounded',
				},
				emptyState: {
					icon: 'i-material-symbols-database-outline',
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
					icon: 'i-material-symbols-arrow-back-rounded',
				},
				nextButton: {
					icon: 'i-material-symbols-arrow-forward-rounded',
				},
			},
		},

		// * Tabs *//
		// tabs: {
		// 	wrapper: 'relative space-y-2',
		// 	container: 'relative w-full',
		// 	base: 'focus:outline-none',
		// 	list: {
		// 		base: 'relative',
		// 		background: 'bg-neutral-100',
		// 		rounded: 'rounded-lg',
		// 		shadow: '',
		// 		padding: 'p-1',
		// 		height: 'h-10',
		// 		width: 'w-full',
		// 		marker: {
		// 			wrapper: 'absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none',
		// 			base: 'w-full h-full',
		// 			background: 'bg-neutral',
		// 			rounded: 'rounded-md',
		// 			shadow: 'shadow-xs',
		// 		},
		// 		tab: {
		// 			base: 'relative inline-flex items-center justify-center flex-shrink/0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500  ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out',
		// 			background: '',
		// 			active: 'text-neutral-900',
		// 			inactive: 'text-neutral-500',
		// 			height: 'h-8',
		// 			padding: 'px-3',
		// 			size: 'text-sm',
		// 			font: 'font-medium',
		// 			rounded: 'rounded-md',
		// 			shadow: '',
		// 			icon: 'w-4 h-4 flex-shrink/0 me-2',
		// 		},
		// 	},
		// },
	},
});
