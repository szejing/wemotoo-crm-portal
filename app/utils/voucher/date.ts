/**
 * Normalizes voucher schedule fields from the API (ISO strings or Date) to ISO strings for form state.
 */
export function voucherDateToFormIso(value: Date | string | null | undefined): string | undefined {
	if (value == null) {
		return undefined;
	}
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) {
		return undefined;
	}
	return date.toISOString();
}
