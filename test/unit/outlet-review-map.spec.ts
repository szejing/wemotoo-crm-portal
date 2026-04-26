import { describe, expect, it } from 'vitest';
import {
	formatOutletCoordinatesLabel,
	googleMapsEmbedSrc,
	isOutletCoordPairAtOrigin,
	parseOutletMapCoords,
} from '../../app/utils/outlet-review-map';

describe('parseOutletMapCoords', () => {
	it('returns undefined when either coordinate is undefined or zero', () => {
		expect(parseOutletMapCoords(undefined, 101.7)).toBeUndefined();
		expect(parseOutletMapCoords(3.15, undefined)).toBeUndefined();
		expect(parseOutletMapCoords(0, 101.7)).toBeUndefined();
		expect(parseOutletMapCoords(3.15, 0)).toBeUndefined();
	});

	it('returns lat/lng when both are finite and non-zero', () => {
		expect(parseOutletMapCoords(3.15, 101.7)).toEqual({ latitude: 3.15, longitude: 101.7 });
		expect(parseOutletMapCoords('3.15', '101.7')).toEqual({ latitude: 3.15, longitude: 101.7 });
	});
});

describe('googleMapsEmbedSrc', () => {
	it('builds a maps.google.com embed query URL', () => {
		const url = googleMapsEmbedSrc(3.15, 101.7);
		expect(url).toContain('maps.google.com/maps');
		expect(url).toContain(encodeURIComponent('3.15,101.7'));
	});
});

describe('formatOutletCoordinatesLabel', () => {
	it('returns empty string when either axis is 0', () => {
		expect(formatOutletCoordinatesLabel(0, 0)).toBe('');
		expect(formatOutletCoordinatesLabel(3, 0)).toBe('');
		expect(formatOutletCoordinatesLabel(0, 101)).toBe('');
	});
});

describe('isOutletCoordPairAtOrigin', () => {
	it('is true only when both parsed values are 0', () => {
		expect(isOutletCoordPairAtOrigin(0, 0)).toBe(true);
		expect(isOutletCoordPairAtOrigin('0', '0')).toBe(true);
		expect(isOutletCoordPairAtOrigin(0, 3)).toBe(false);
		expect(isOutletCoordPairAtOrigin(null, null)).toBe(false);
	});
});
