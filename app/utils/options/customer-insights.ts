import {
	CUSTOMER_INSIGHT_PRESETS,
	CustomerInsightCategory,
	CustomerInsightConfidence,
	CustomerInsightKey,
	CustomerInsightSeverity,
	type CustomerInsightPreset,
} from 'yeppi-common';

type TranslateFn = (key: string) => string;

export type CustomerInsightTraitOption = CustomerInsightPreset & {
	label: string;
};

export type CustomerInsightSelectOption = {
	label: string;
	value: CustomerInsightKey;
	category: CustomerInsightCategory;
	defaultSeverity: CustomerInsightSeverity;
};

const insightLabelKey = (key: CustomerInsightKey) => `pages.customerInsights.traits.${key}`;

export const customerInsightTraitOptions = (t: TranslateFn): CustomerInsightSelectOption[] =>
	CUSTOMER_INSIGHT_PRESETS.map((preset) => ({
		label: t(insightLabelKey(preset.key)),
		value: preset.key,
		category: preset.category,
		defaultSeverity: preset.defaultSeverity,
	}));

export const customerInsightCategoryOptions = (t: TranslateFn) =>
	Object.values(CustomerInsightCategory).map((value) => ({
		label: t(`pages.customerInsights.categories.${value}`),
		value,
	}));

export const customerInsightSeverityOptions = (t: TranslateFn) =>
	Object.values(CustomerInsightSeverity).map((value) => ({
		label: t(`pages.customerInsights.severities.${value}`),
		value,
	}));

export const customerInsightConfidenceOptions = (t: TranslateFn) =>
	Object.values(CustomerInsightConfidence).map((value) => ({
		label: t(`pages.customerInsights.confidences.${value}`),
		value,
	}));

export const customerInsightLabel = (t: TranslateFn, key: CustomerInsightKey | string) => t(insightLabelKey(key as CustomerInsightKey));

export const customerInsightSeverityColor = (severity?: CustomerInsightSeverity) => {
	switch (severity) {
		case CustomerInsightSeverity.RISK:
			return 'error';
		case CustomerInsightSeverity.WARNING:
			return 'warning';
		default:
			return 'info';
	}
};
