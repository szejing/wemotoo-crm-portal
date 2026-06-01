import { describe, expect, it } from 'vitest';
import {
	CUSTOMER_INSIGHT_PRESETS,
	CustomerInsightKey,
	CustomerInsightSeverity,
} from 'wemotoo-common';
import {
	customerInsightLabel,
	customerInsightSeverityColor,
	customerInsightTraitOptions,
} from '../../app/utils/options/customer-insights';

describe('customer-insights options', () => {
	const t = (key: string) => key;

	it('maps presets to select options', () => {
		const options = customerInsightTraitOptions(t);
		expect(options).toHaveLength(CUSTOMER_INSIGHT_PRESETS.length);
		expect(options[0]).toMatchObject({
			value: expect.any(String),
			category: expect.any(String),
			defaultSeverity: expect.any(String),
			label: expect.stringContaining('pages.customerInsights.traits.'),
		});
	});

	it('returns severity colors for known values', () => {
		expect(customerInsightSeverityColor(CustomerInsightSeverity.RISK)).toBe('error');
		expect(customerInsightSeverityColor(CustomerInsightSeverity.WARNING)).toBe('warning');
		expect(customerInsightSeverityColor(CustomerInsightSeverity.INFO)).toBe('info');
	});

	it('returns translated trait labels', () => {
		expect(customerInsightLabel(t, CustomerInsightKey.POLITE)).toBe('pages.customerInsights.traits.polite');
	});
});
