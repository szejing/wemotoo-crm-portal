/**
 * Coordinates for the outlet review map preview: both finite, non-zero (0,0 is considered unset for map purposes).
 */
export function parseOutletMapCoords(
	lat: number | string | null | undefined,
	lng: number | string | null | undefined,
): { latitude: number; longitude: number } | undefined {
	const n = (v: number | string | null | undefined) => {
		if (v === '' || v == null) return null;
		const x = typeof v === 'number' ? v : Number(v);
		return Number.isFinite(x) ? x : null;
	};
	const la = n(lat);
	const lo = n(lng);
	if (la == null || lo == null) return undefined;
	if (la === 0 || lo === 0) return undefined;
	return { latitude: la, longitude: lo };
}

/** Text for the review panel; empty when either value is missing or 0 (same rules as the map). */
export function formatOutletCoordinatesLabel(
	lat: number | string | null | undefined,
	lng: number | string | null | undefined,
): string {
	const n = (v: number | string | null | undefined) => {
		if (v === '' || v == null) return null;
		const x = typeof v === 'number' ? v : Number(v);
		return Number.isFinite(x) ? x : null;
	};
	const la = n(lat);
	const lo = n(lng);
	if (la == null || lo == null) return '';
	if (la === 0 || lo === 0) return '';
	return `${la}, ${lo}`;
}

/** True when both values parse to 0 (hide the whole coordinates row; unset/null/undefined is false). */
export function isOutletCoordPairAtOrigin(
	lat: number | string | null | undefined,
	lng: number | string | null | undefined,
): boolean {
	const n = (v: number | string | null | undefined) => {
		if (v === '' || v == null) return null;
		const x = typeof v === 'number' ? v : Number(v);
		return Number.isFinite(x) ? x : null;
	};
	return n(lat) === 0 && n(lng) === 0;
}

export function googleMapsEmbedSrc(latitude: number, longitude: number): string {
	return `https://maps.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}&z=16&output=embed&hl=en`;
}
