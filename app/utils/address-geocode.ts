/**
 * Free-form address string for Nominatim / map search. Omits empty parts.
 * Order: line1, line2, line3, postcode, city, state, country.
 */
export function buildOutletAddressSearchQuery(input: {
	address1?: string | null;
	address2?: string | null;
	address3?: string | null;
	postalCode?: string | null;
	city?: string | null;
	stateName?: string | null;
	countryCode?: string | null;
}): string {
	const parts: string[] = [];
	const push = (s: string | null | undefined) => {
		const t = s?.trim();
		if (t) parts.push(t);
	};
	push(input.address1);
	push(input.address2);
	push(input.address3);
	push(input.postalCode);
	push(input.city);
	push(input.stateName);
	push(input.countryCode);
	return parts.join(', ');
}

/** Open Google Maps in the browser to search; no Geocoding API (no key / billing). */
export function googleMapsWebSearchUrl(query: string): string {
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

type NominatimHit = { lat?: string; lon?: string };

/**
 * Nominatim /search returns JSON array; take first result's lat/lon.
 */
export function parseNominatimSearchFirstHit(data: unknown): { latitude: number; longitude: number } | null {
	if (!Array.isArray(data) || data.length === 0) return null;
	const row = data[0] as NominatimHit;
	const latS = row.lat;
	const lonS = row.lon;
	if (latS == null || lonS == null) return null;
	const latitude = Number(latS);
	const longitude = Number(lonS);
	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
	return { latitude, longitude };
}
