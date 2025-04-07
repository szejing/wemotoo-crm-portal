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
			'xs': '475px',

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
			'md': '0.95rem',
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
				lato: ['Lato'],
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
				main: '#F37323',
				secondary: '#003B72',
				neutral: '#6A7077',
			},
		},
	},
	plugins: [],
};
