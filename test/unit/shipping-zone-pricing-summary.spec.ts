import { describe, expect, it } from 'vitest';
import { parsePricingSummarySegments } from '../../app/utils/shipping-zone-pricing-summary';

describe('parsePricingSummarySegments', () => {
	it('splits middle-dot segments and label: fee pairs', () => {
		expect(parsePricingSummarySegments('Pickup: 0 · Same-Day Delivery: 12.5')).toEqual([
			{ label: 'Pickup', fee: 0 },
			{ label: 'Same-Day Delivery', fee: 12.5 },
		]);
	});

	it('handles a single method', () => {
		expect(parsePricingSummarySegments('Standard Delivery: 0')).toEqual([{ label: 'Standard Delivery', fee: 0 }]);
	});

	it('handles fee-only segments', () => {
		expect(parsePricingSummarySegments('42')).toEqual([{ label: '', fee: 42 }]);
	});

	it('returns empty for blank input', () => {
		expect(parsePricingSummarySegments('   ')).toEqual([]);
	});
});
