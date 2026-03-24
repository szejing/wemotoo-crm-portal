import { describe, expect, it } from 'vitest';
import { pathForSignature } from '../../server/base_api';

describe('pathForSignature (signed upstream path)', () => {
	it('prefixes /api and normalizes segment slashes', () => {
		expect(pathForSignature('settings/')).toMatch(/^\/api\/settings/);
		expect(pathForSignature('/merchant/settings/')).toMatch(/^\/api\/merchant\/settings/);
	});

	it('includes sorted query in canonical string when query is provided', () => {
		const a = pathForSignature('settings/', { $top: 10, $skip: 0 });
		const b = pathForSignature('settings/', { $skip: 0, $top: 10 });
		expect(a).toBe(b);
	});
});
