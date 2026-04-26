import { describe, expect, it } from 'vitest';
import { buildOutletAddressSearchQuery, googleMapsWebSearchUrl, parseNominatimSearchFirstHit } from '../../app/utils/address-geocode';

describe('buildOutletAddressSearchQuery', () => {
	it('joins non-empty parts with comma-space', () => {
		expect(
			buildOutletAddressSearchQuery({
				address1: ' 1 Jln Test ',
				address2: '',
				address3: undefined,
				postalCode: '50000',
				city: 'KL',
				stateName: 'Wilayah Persekutuan',
				countryCode: 'MY',
			}),
		).toBe('1 Jln Test, 50000, KL, Wilayah Persekutuan, MY');
	});

	it('returns empty when all parts empty', () => {
		expect(
			buildOutletAddressSearchQuery({
				address1: '',
				city: '  ',
			}),
		).toBe('');
	});
});

describe('googleMapsWebSearchUrl', () => {
	it('encodes query for the public Maps website', () => {
		const u = googleMapsWebSearchUrl('1 Jln Test, 50000');
		expect(u).toContain('https://www.google.com/maps/search/');
		expect(u).toContain(encodeURIComponent('1 Jln Test, 50000'));
	});
});

describe('parseNominatimSearchFirstHit', () => {
	it('returns null for empty or invalid payload', () => {
		expect(parseNominatimSearchFirstHit(null)).toBeNull();
		expect(parseNominatimSearchFirstHit([])).toBeNull();
		expect(parseNominatimSearchFirstHit([{}])).toBeNull();
	});

	it('parses first result lat and lon as numbers', () => {
		expect(
			parseNominatimSearchFirstHit([
				{ lat: '3.140853', lon: '101.693207', display_name: 'Kuala Lumpur' },
			]),
		).toEqual({ latitude: 3.140853, longitude: 101.693207 });
	});
});
