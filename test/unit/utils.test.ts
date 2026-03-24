import { describe, expect, it } from 'vitest';
import { removeNullValues } from '../../app/utils/utils';

describe('removeNullValues (unit / node)', () => {
	it('strips null and undefined from plain objects', () => {
		expect(removeNullValues({ a: 1, b: null, c: undefined })).toEqual({ a: 1 });
	});
});
