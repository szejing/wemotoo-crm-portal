/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./components/**/*.{vue,js,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./app.vue',
		'./plugins/**/*.{js,ts}',
		`./App.{js,ts,vue}`,
		`./app.{js,ts,vue}`,
		`./nuxt.config.{js,ts}`,
	],
	theme: {
		screens: {
			'sm': '640px',
			// => @media (min-width: 640px) { ... }

			'md': '768px',
			// => @media (min-width: 768px) { ... }

			'lg': '1024px',
			// => @media (min-width: 1024px) { ... }

			'xl': '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px',
			// => @media (min-width: 1536px) { ... }
		},
		fontSize: {
			'xs': '0.8rem',
			'sm': '0.9rem',
			'base': '1rem',
			'lg': '1.12rem',
			'xl': '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.75rem',
			'4xl': '2.441rem',
			'5xl': '3.052rem',
		},
		extend: {
			fontFamily: {
				nunito: ['Nunito'],
			},
			borderRadius: {
				card: 'var(--border-radius-card)',
				button: 'var(--border-radius-button)',
				input: 'var(--border-radius-input)',
				panel: 'var(--border-radius-panel)',
			},
			animation: {
				'fade-in': 'fade-in 0.5s linear forwards',
			},
			keyframes: {
				'fade-in': {
					from: {
						opacity: '0',
					},
					to: {
						opacity: '1',
					},
				},
			},
			colors: {
				primary: {
					DEFAULT: '#F37323',
					100: '#FEF1E9',
					200: '#FCDCC8',
					300: '#FAC7A7',
					400: '#F79D65',
					500: '#F37323',
					600: '#DB6820',
					700: '#924515',
					800: '#6D3410',
					900: '#49230B',
				},
				secondary: {
					DEFAULT: '#003B72',
					100: '#E6EBF1',
					200: '#BFCEDC',
					300: '#99B1C7',
					400: '#4D769C',
					500: '#003B72',
					600: '#003567',
					700: '#002344',
					800: '#001B33',
					900: '#001222',
				},
				neutral: {
					DEFAULT: '#6A7077',
					100: '#EEEEEE',
					200: '#E8E8E8',
					300: '#C4C4C4',
					400: '#9E9E9E',
					500: '#6A7077',
					600: '#61676D',
					700: '#3E4348',
					800: '#1F2326',
					900: '#151414',
				},
			},
		},
	},
	plugins: [],
};
