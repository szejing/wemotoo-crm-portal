/* eslint-disable @stylistic/quotes */
import { theme } from '~/theme';

export default defineAppConfig({
	// title: 'HeroesTech Solutions',
	// tagline: 'A modern web development company',
	// address: 'Floor D 20-08, Menara Mitraland 13A, Jalan PJU 5/1, Kota Damansara, 47810 Petaling Jaya',
	theme,
	ui: {
		strategy: 'override',
		colors: {
			primary: theme.main,
			neutral: theme.gray,
		},

		//* Modal *//
		modal: {
			slots: {
				root: 'w-full max-w-[90%] sm:max-w-[60%]',
			},
		},
		//* Notification *//
		notifications: {
			position: 'bottom-0 right-0 top-auto left-auto',
		},

		notification: {
			slots: {
				root: 'bg-{color}-500',
				title: 'text-sm font-medium text-white',
				description: 'mt-1 text-sm leading-4 text-white',
				icon: 'text-white',
				progress: 'bg-white',
			},
		},

		//* Card *//
		card: {
			slots: {
				root: 'transition duration-200 py-2 bg-white shadow-md divide-none rounded',
				header: 'px-4 py-2',
				body: 'px-4 py-3',
				footer: 'px-4 pt-2 pb-2',
			},
		},

		//* Button *//
		button: {
			slots: {
				base: 'transition duration-200 font-bold rounded',
			},
			defaultVariants: {
				size: 'md',
				color: 'primary',
				loadingIcon: 'i-material-symbols-sync-rounded',
			},
			variants: {
				size: {
					'2xs': 'text-xs md:text-xs px-2 py-1',
					'xs': 'text-xs md:text-xs px-2.5 py-1',
					'sm': 'text-sm md:text-sm px-2.5 py-1',
					'md': 'text-sm md:text-base px-3 py-2',
					'lg': 'text-sm md:text-xl px-5 py-3',
					'xl': 'text-sm md:text-2xl px-10 py-3',
				},
				color: {
					primary: {
						solid: 'button-primary-solid disabled:button-primary-solid-disabled',
						outline: 'button-primary-outline disabled:button-primary-outline-disabled',
					},
					success: {
						solid: 'button-green-solid',
						outline: 'button-green-outline disabled:button-green-outline-disabled',
					},
					error: {
						solid: 'button-red-solid',
						soft: 'button-red-soft',
						ghost: 'button-red-ghost',
						outline: 'button-red-outline disabled:button-red-outline-disabled',
					},
					neutral: {
						solid: 'button-neutral-solid',
						ghost: 'button-neutral-ghost',
						soft: 'button-neutral-soft',
						outline: 'button-neutral-outline disabled:button-neutral-outline-disabled',
					},
					white: {
						link: 'button-white-link',
					},
				},
			},
		},

		//* Badge *//
		badge: {
			slots: {
				root: 'rounded',
			},
		},

		checkbox: {
			slots: {
				root: 'flex items-center h-6',
				base: 'h-5 w-5 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent',
				label: 'text-base font-medium text-neutral-700',
				required: 'text-base text-error-500',
				help: 'text-base text-neutral-500',
			},
		},

		// * FormField *//
		formField: {
			slots: {
				wrapper: '',
				inner: '',
				label: 'block font-normal text-secondary-700',
				container: 'mt-1 relative',
				description: 'text-neutral-500',
				hint: 'text-neutral-500',
				help: 'mt-2 text-neutral-500',
				error: 'mt-2 text-error-500',
			},
			defaultVariants: {
				size: 'sm',
			},
			variants: {
				size: {
					'2xs': 'text-xs md:text-xs',
					'xs': 'text-xs md:text-xs',
					'sm': 'text-sm md:text-sm',
					'md': 'text-sm md:text-base',
					'lg': 'text-sm md:text-xl',
					'xl': 'text-sm md:text-2xl',
				},
			},
		},

		//* Input *//
		input: {
			slots: {
				base: 'rounded',
			},
			defaultVariants: {
				size: 'md',
				loadingIcon: 'i-material-symbols-sync-rounded',
			},
			variants: {
				size: {
					'2xs': 'text-xs md:text-xs px-2 py-1',
					'xs': 'text-xs md:text-xs px-2 py-1',
					'sm': 'text-sm md:text-sm px-2 py-1',
					'md': 'text-sm md:text-md px-4 py-2',
					'lg': 'text-base md:text-xl px-4 py-2',
					'xl': 'text-base md:text-2xl px-4 py-3',
				},
			},
		},

		//* Textarea *//
		textarea: {
			slots: {
				root: 'rounded',
			},
		},

		//* Select *//
		select: {
			slots: {
				base: 'rounded',
				placeholder: 'text-neutral-400',
			},
			defaultVariants: {
				loadingIcon: 'i-material-symbols-sync-rounded',
				trailingIcon: 'i-material-symbols-expand-more-rounded',
			},
			variants: {
				size: {
					'2xs': 'text-xs md:text-xs px-2 py-1',
					'xs': 'text-xs md:text-xs px-2 py-1',
					'sm': 'text-sm md:text-sm px-2 py-1',
					'md': 'text-sm md:text-base px-4 py-2',
					'lg': 'text-sm md:text-xl px-4 py-2',
					'xl': 'text-sm md:text-2xl px-4 py-3',
				},
			},
		},

		//* Select Menu *//
		selectMenu: {
			slots: {
				base: 'rounded px-2 py-2',
				option: 'px-4 py-1',
				placeholder: 'text-neutral-400',
			},
			defaultVariants: {
				selectedIcon: 'i-material-symbols-fitbit-check-small-rounded',
			},
		},

		//* Command Palette *//
		commandPalette: {
			defaultVariants: {
				icon: 'i-material-symbols-search-rounded',
				loadingIcon: 'i-material-symbols-sync-rounded',
				selectedIcon: 'i-material-symbols-fitbit-check-small-rounded',
				emptyStateIcon: 'i-material-symbols-search-rounded',
			},
		},

		//* Table *//
		table: {
			slots: {
				wrapper: 'relative overflow-x-auto',
			},
			defaultVariants: {
				sortAscIcon: 'octicon:sort-asc-24',
				sortDescIcon: 'octicon:sort-desc-24',
				loadingIcon: 'i-material-symbols-sync-rounded',
				emptyStateIcon: 'i-material-symbols-database-outline',
			},
		},

		//* Avatar *//
		avatar: {
			slots: {
				root: 'rounded',
			},
		},

		//* Breadcrumb *//
		breadcrumb: {
			slots: {
				root: 'flex items-center gap-x-1.5 text-secondary-200 text-sm leading-6 min-w-0',
				item: 'flex items-center gap-x-1.5 group font-light min-w-0',
				active: 'text-secondary-800 font-medium',
				inactive: 'hover:text-secondary-500',
			},
			defaultVariants: {
				divider: 'i-material-symbols-light-chevron-right',
			},
		},

		//* Pagination *//
		pagination: {
			slots: {
				root: 'first:rounded-l-button last:rounded-r-button',
			},
			defaultVariants: {
				prevIcon: 'i-material-symbols-arrow-back-rounded',
				nextIcon: 'i-material-symbols-arrow-forward-rounded',
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
		// 			background: 'bg-white',
		// 			rounded: 'rounded-md',
		// 			shadow: 'shadow-sm',
		// 		},
		// 		tab: {
		// 			base: 'relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500  ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out',
		// 			background: '',
		// 			active: 'text-neutral-900',
		// 			inactive: 'text-neutral-500',
		// 			height: 'h-8',
		// 			padding: 'px-3',
		// 			size: 'text-sm',
		// 			font: 'font-medium',
		// 			rounded: 'rounded-md',
		// 			shadow: '',
		// 			icon: 'w-4 h-4 flex-shrink-0 me-2',
		// 		},
		// 	},
		// },
	},
});
