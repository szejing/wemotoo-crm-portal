import type { State } from './state';

export type Country = {
	iso2: string;
	dial_code: string;
	display_name: string;
	is_active: false;
	states: State[];
};
