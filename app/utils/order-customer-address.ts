import type { AddressModel } from './models/customer.model';
import { buildOutletAddressSearchQuery, googleMapsWebSearchUrl } from './address-geocode';

/** Multiline text matching the order detail shipping/billing display (lines + city row). */
export function formatOrderAddressMultiline(address: AddressModel | undefined): string {
	if (!address) return '';
	const lines: string[] = [];
	const push = (s: string | null | undefined) => {
		const t = s?.trim();
		if (t) lines.push(t);
	};
	push(address.address1);
	push(address.address2);
	push(address.address3);
	const cityLine = [address.city, address.state, address.postal_code, address.country_code].filter((p) => p?.trim()).join(', ');
	if (cityLine) lines.push(cityLine);
	return lines.join('\n');
}

/** Single-line query for Google/public map search from CRM address fields. */
export function orderAddressToMapsSearchQuery(address: AddressModel | undefined): string {
	if (!address) return '';
	return buildOutletAddressSearchQuery({
		address1: address.address1,
		address2: address.address2,
		address3: address.address3,
		postalCode: address.postal_code,
		city: address.city,
		stateName: address.state,
		countryCode: address.country_code,
	});
}

export function orderAddressGoogleMapsUrl(address: AddressModel | undefined): string | null {
	const q = orderAddressToMapsSearchQuery(address);
	if (!q) return null;
	return googleMapsWebSearchUrl(q);
}
