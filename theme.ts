export interface Theme {
	main: string;
	borderRadius: 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'full';
	googleFonts: {
		[key: string]: boolean | number[];
	};
}

export const theme = {
	main: 'main',
	secondary: 'secondary',
	borderRadius: 'lg',
	googleFonts: {
		lato: true,
	},
} as Theme;
