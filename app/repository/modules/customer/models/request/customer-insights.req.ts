import type { CustomerInsightCategory, CustomerInsightConfidence, CustomerInsightKey, CustomerInsightSeverity } from 'yeppi-common';

export type CustomerInsightInput = {
	key: CustomerInsightKey;
	category: CustomerInsightCategory;
	note?: string;
	confidence?: CustomerInsightConfidence;
	severity?: CustomerInsightSeverity;
	value?: string | number | boolean;
};

export type UpdateCustomerInsightsReq = {
	merchant_id: string;
	action: 'add' | 'remove';
	insight?: CustomerInsightInput;
	insight_id?: string;
};
