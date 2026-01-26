import { theme } from '../theme';

export default defineAppConfig({
	// title: 'HeroesTech Solutions',
	// tagline: 'A modern web development company',
	// address: 'Floor D 20-08, Menara Mitraland 13A, Jalan PJU 5/1, Kota Damansara, 47810 Petaling Jaya',
	theme,
	ui: {
		strategy: 'merge',

		colors: {
			primary: theme.main,
		},

		//* * Card */
		card: {
			slots: {
				root: 'shadow-sm',
			},
		},

		//* * Input */
		input: {
			slots: {
				root: 'w-full',
			},
		},

		// SelectMenu
		selectMenu: {
			slots: {
				base: 'min-w-30 sm:min-w-40',
				content: 'min-w-fit',
				trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
			},
		},
	},
});
