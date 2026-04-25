import { describe, expect, it } from 'vitest';
import {
	MALAYSIA_STATE_OPTIONS,
	mergeMalaysiaStateOptions,
	parseStatesFromApi,
	serializeStatesForApi,
} from '../../app/utils/data/malaysia-states';

describe('malaysia-states', () => {
	it('lists 13 states and 3 federal territories', () => {
		expect(MALAYSIA_STATE_OPTIONS).toHaveLength(16);
	});

	it('prepends unknown current values for legacy zones', () => {
		const merged = mergeMalaysiaStateOptions(['Legacy District']);
		expect(merged[0]).toEqual({ label: 'Legacy District', value: 'Legacy District' });
		expect(merged).toHaveLength(17);
	});

	it('does not duplicate when current value is already listed', () => {
		const merged = mergeMalaysiaStateOptions(['Johor']);
		expect(merged).toHaveLength(16);
		expect(merged.some((o) => o.value === 'Johor')).toBe(true);
	});

	it('serializes and parses multiple states via API delimiter', () => {
		const s = serializeStatesForApi(['Johor', 'Selangor']);
		expect(s).toBe('Johor|Selangor');
		expect(parseStatesFromApi(s)).toEqual(['Johor', 'Selangor']);
	});

	it('parses a single legacy state without delimiter', () => {
		expect(parseStatesFromApi('Selangor')).toEqual(['Selangor']);
	});
});
