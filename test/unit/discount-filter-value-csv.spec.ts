import { describe, expect, it } from 'vitest';
import { parseFilterValueCsv, stringifyFilterValueCsv } from '../../app/utils/discount/filter-value-csv';

describe('discount filter value csv helpers', () => {
	it('parses comma separated values and trims spaces', () => {
		expect(parseFilterValueCsv(' PROD1, PROD2 , ,PROD3')).toEqual(['PROD1', 'PROD2', 'PROD3']);
	});

	it('joins selected values into a comma separated string', () => {
		expect(stringifyFilterValueCsv(['PROD1', 'PROD2'])).toBe('PROD1,PROD2');
	});

	it('deduplicates values when joining', () => {
		expect(stringifyFilterValueCsv(['PROD1', 'PROD2', 'PROD1'])).toBe('PROD1,PROD2');
	});
});
