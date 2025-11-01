export interface DataStat {
	title: string;
	icon: string;
	value: number | string;
	variation: number;
	formatter?: (value: number) => string;
}
