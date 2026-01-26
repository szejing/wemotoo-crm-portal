/* eslint-disable @stylistic/quote-props */

export type BaseODataResp<T> = {
	'@odata.context'?: string;
	'@odata.count'?: number;
	data: T[];
	count: number;
	value: T[];
};
