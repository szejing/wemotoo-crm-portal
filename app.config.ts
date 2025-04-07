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
			gray: theme.gray,
		},

		//* Modal *//
		modal: {
			slots: {
				root: 'w-full max-w-[90%] sm:max-w-[60%]',
			},
		},

		//* Notification *//
		toast: {
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
			root: 'transition duration-200 py-2',
			background: 'bg-neutral',
			shadow: 'shadow-md',
			divide: 'divide-none',
			rounded: 'rounded',
			header: 'px-4 py-2',
			body: 'px-4 py-3',
			footer: 'px-4 pt-2 pb-2',
		},

		//* Button *//
		button: {
			slots: {
				base: 'rounded-[calc(var(--ui-radius)*1.5)] font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors',
				label: 'truncate',
				leadingIcon: 'shrink-0',
				leadingAvatar: 'shrink-0',
				leadingAvatarSize: '',
				trailingIcon: 'shrink-0',
			},
			variants: {
				buttonGroup: {
					horizontal: 'not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none',
					vertical: 'not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none',
				},
				color: {
					primary: '',
					secondary: '',
					success: '',
					info: '',
					warning: '',
					error: '',
					neutral: '',
				},
				variant: {
					solid: '',
					outline: '',
					soft: '',
					subtle: '',
					ghost: '',
					link: '',
				},
				size: {
					xs: {
						base: 'px-2 py-1 text-xs gap-1',
						leadingIcon: 'size-4',
						leadingAvatarSize: '3xs',
						trailingIcon: 'size-4',
					},
					sm: {
						base: 'px-2.5 py-1.5 text-xs gap-1.5',
						leadingIcon: 'size-4',
						leadingAvatarSize: '3xs',
						trailingIcon: 'size-4',
					},
					md: {
						base: 'px-2.5 py-1.5 text-sm gap-1.5',
						leadingIcon: 'size-5',
						leadingAvatarSize: '2xs',
						trailingIcon: 'size-5',
					},
					lg: {
						base: 'px-3 py-2 text-sm gap-2',
						leadingIcon: 'size-5',
						leadingAvatarSize: '2xs',
						trailingIcon: 'size-5',
					},
					xl: {
						base: 'px-3 py-2 text-base gap-2',
						leadingIcon: 'size-6',
						leadingAvatarSize: 'xs',
						trailingIcon: 'size-6',
					},
				},
				block: {
					true: {
						base: 'w-full justify-center',
						trailingIcon: 'ms-auto',
					},
				},
				square: {
					true: '',
				},
				leading: {
					true: '',
				},
				trailing: {
					true: '',
				},
				loading: {
					true: '',
				},
				active: {
					true: {
						base: '',
					},
					false: {
						base: '',
					},
				},
			},
			compoundVariants: [
				{
					color: 'primary',
					variant: 'solid',
					class:
						'text-(--ui-bg) bg-(--ui-primary) hover:bg-(--ui-primary)/75 disabled:bg-(--ui-primary) aria-disabled:bg-(--ui-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-primary)',
				},
				{
					color: 'primary',
					variant: 'outline',
					class:
						'ring ring-inset ring-(--ui-primary)/50 text-(--ui-primary) hover:bg-(--ui-primary)/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-primary)',
				},
				{
					color: 'primary',
					variant: 'soft',
					class:
						'text-(--ui-primary) bg-(--ui-primary)/10 hover:bg-(--ui-primary)/15 focus:outline-none focus-visible:bg-(--ui-primary)/15 disabled:bg-(--ui-primary)/10 aria-disabled:bg-(--ui-primary)/10',
				},
				{
					color: 'primary',
					variant: 'subtle',
					class:
						'text-(--ui-primary) ring ring-inset ring-(--ui-primary)/25 bg-(--ui-primary)/10 hover:bg-(--ui-primary)/15 disabled:bg-(--ui-primary)/10 aria-disabled:bg-(--ui-primary)/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-primary)',
				},
				{
					color: 'primary',
					variant: 'ghost',
					class:
						'text-(--ui-primary) hover:bg-(--ui-primary)/10 focus:outline-none focus-visible:bg-(--ui-primary)/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent',
				},
				{
					color: 'primary',
					variant: 'link',
					class:
						'text-(--ui-primary) hover:text-(--ui-primary)/75 disabled:text-(--ui-primary) aria-disabled:text-(--ui-primary) focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-primary)',
				},
				{
					color: 'neutral',
					variant: 'solid',
					class:
						'text-(--ui-bg) bg-(--ui-bg-inverted) hover:bg-(--ui-bg-inverted)/90 disabled:bg-(--ui-bg-inverted) aria-disabled:bg-(--ui-bg-inverted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-border-inverted)',
				},
				{
					color: 'neutral',
					variant: 'outline',
					class:
						'ring ring-inset ring-(--ui-border-accented) text-(--ui-text) bg-(--ui-bg) hover:bg-(--ui-bg-elevated) disabled:bg-(--ui-bg) aria-disabled:bg-(--ui-bg) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-border-inverted)',
				},
				{
					color: 'neutral',
					variant: 'soft',
					class:
						'text-(--ui-text) bg-(--ui-bg-elevated) hover:bg-(--ui-bg-accented)/75 focus:outline-none focus-visible:bg-(--ui-bg-accented)/75 disabled:bg-(--ui-bg-elevated) aria-disabled:bg-(--ui-bg-elevated)',
				},
				{
					color: 'neutral',
					variant: 'subtle',
					class:
						'ring ring-inset ring-(--ui-border-accented) text-(--ui-text) bg-(--ui-bg-elevated) hover:bg-(--ui-bg-accented)/75 disabled:bg-(--ui-bg-elevated) aria-disabled:bg-(--ui-bg-elevated) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-border-inverted)',
				},
				{
					color: 'neutral',
					variant: 'ghost',
					class:
						'text-(--ui-text) hover:bg-(--ui-bg-elevated) focus:outline-none focus-visible:bg-(--ui-bg-elevated) hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent',
				},
				{
					color: 'neutral',
					variant: 'link',
					class:
						'text-(--ui-text-muted) hover:text-(--ui-text) disabled:text-(--ui-text-muted) aria-disabled:text-(--ui-text-muted) focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-(--ui-border-inverted)',
				},
				{
					size: 'xs',
					square: true,
					class: 'p-1',
				},
				{
					size: 'sm',
					square: true,
					class: 'p-1.5',
				},
				{
					size: 'md',
					square: true,
					class: 'p-1.5',
				},
				{
					size: 'lg',
					square: true,
					class: 'p-2',
				},
				{
					size: 'xl',
					square: true,
					class: 'p-2',
				},
				{
					loading: true,
					leading: true,
					class: {
						leadingIcon: 'animate-spin',
					},
				},
				{
					loading: true,
					leading: false,
					trailing: true,
					class: {
						trailingIcon: 'animate-spin',
					},
				},
			],
			defaultVariants: {
				color: 'primary',
				variant: 'solid',
				size: 'md',
			},
		},

		//* Badge *//
		badge: {
			rounded: 'rounded',
		},

		checkbox: {
			container: 'flex items-center h-6',
			root: 'h-5 w-5 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent',
			label: 'text-base font-medium text-neutral-700',
			required: 'text-base text-red-500 ',
			help: 'text-base text-neutral-500 ',
		},

		// * FormField *//
		formField: {
			root: '',
			wrapper: '',
			labelWrapper: 'flex content-center items-center justify-between',
			label: 'block font-medium text-(--ui-text)',
			container: 'mt-1 relative',
			description: 'text-(--ui-text-muted)',
			error: 'mt-2 text-(--ui-error)',
			hint: 'text-(--ui-text-muted)',
			help: 'mt-2 text-(--ui-text-muted)',
			variants: {
				size: {
					xs: {
						root: 'text-xs',
					},
					sm: {
						root: 'text-xs',
					},
					md: {
						root: 'text-sm',
					},
					lg: {
						root: 'text-sm',
					},
					xl: {
						root: 'text-base',
					},
				},
				required: {
					true: {
						label: "after:content-['*'] after:ms-0.5 after:text-(--ui-error)",
					},
				},
			},
			defaultVariants: {
				size: 'md',
			},
		},

		//* Input *//
		input: {
			slots: {
				root: 'w-full relative inline-flex items-center',
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
				// leading: {
				// 	padding: {
				// 		'2xs': 'ps-8',
				// 		'xs': 'ps-9',
				// 		'sm': 'ps-10',
				// 		'md': 'ps-11',
				// 		'lg': 'ps-12',
				// 		'xl': 'ps-13',
				// 	},
				// },
				// trailing: {
				// 	padding: {
				// 		'2xs': 'pe-8',
				// 		'xs': 'pe-9',
				// 		'sm': 'pe-10',
				// 		'md': 'pe-11',
				// 		'lg': 'pe-12',
				// 		'xl': 'pe-13',
				// 	},
				// },
				default: {
					size: 'md',
					loadingIcon: 'i-material-symbols-sync-rounded',
				},
				rounded: 'rounded',
			},
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
			root: 'flex items-center gap-x-1.5 group font-light min-w-0',
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
		// 	root: 'focus:outline-none',
		// 	list: {
		// 		root: 'relative',
		// 		background: 'bg-neutral-100',
		// 		rounded: 'rounded-lg',
		// 		shadow: '',
		// 		padding: 'p-1',
		// 		height: 'h-10',
		// 		width: 'w-full',
		// 		marker: {
		// 			wrapper: 'absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none',
		// 			root: 'w-full h-full',
		// 			background: 'bg-neutral',
		// 			rounded: 'rounded-md',
		// 			shadow: 'shadow-xs',
		// 		},
		// 		tab: {
		// 			root: 'relative inline-flex items-center justify-center flex-shrink/0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500  ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out',
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
