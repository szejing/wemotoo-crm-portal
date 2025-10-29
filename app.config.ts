import { theme } from '~/theme';

export default defineAppConfig({
	// title: 'HeroesTech Solutions',
	// tagline: 'A modern web development company',
	// address: 'Floor D 20-08, Menara Mitraland 13A, Jalan PJU 5/1, Kota Damansara, 47810 Petaling Jaya',
	theme,
	ui: {
		strategy: 'merge',
		icons: {
			loading: 'i-material-symbols-sync-rounded',
		},
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
	},
});
