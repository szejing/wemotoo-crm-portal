import { describe, expect, it } from 'vitest';
import { hhmmToSelectLabel, selectLabelToHhmm, normalizeToHhmm } from '../../app/utils/time-select-hh24';

describe('time-select-hh24', () => {
	it('round-trips on-the-hour API values', () => {
		expect(hhmmToSelectLabel('0900')).toBe('09.00 am');
		expect(hhmmToSelectLabel('1900')).toBe('07.00 pm');
		expect(hhmmToSelectLabel('0000')).toBe('12.00 am');
		expect(hhmmToSelectLabel('1200')).toBe('12.00 pm');
		expect(selectLabelToHhmm('09.00 am')).toBe('0900');
		expect(selectLabelToHhmm('07.00 pm')).toBe('1900');
	});

	it('normalizes 3- and 2-digit input', () => {
		expect(normalizeToHhmm('900')).toBe('0900');
		expect(normalizeToHhmm('9')).toBe('0900');
	});

	it('selectLabelToHhmm returns null for unknown label', () => {
		expect(selectLabelToHhmm('nope')).toBeNull();
	});
});
