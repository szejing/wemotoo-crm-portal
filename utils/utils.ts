export const fractionDigits = 2;

/**
 * Checks if the input is numeric.
 * @param value The value to check.
 * @returns True if the input is numeric, false otherwise.
 */
export function isNumeric(value: any): boolean {
	if (typeof value === 'number') return true;
	if (typeof value !== 'string') return false;

	return !isNaN(parseFloat(value)) && isFinite(value as any);
}

export function formatCurrency(value: number, fractionDigits: number = 2): string {
	if (value === null || value === undefined) {
		throw new Error('value cannot be null or undefined');
	}

	// Convert cents into hundreds.
	value = value / 100;

	// Format the number to the specified fraction digits
	const formattedValue = value.toFixed(fractionDigits);

	return formattedValue;
}

export const capitalizeFirstLetter = (value: string | any) => {
	if (value === undefined) return undefined;

	if (value.includes('_')) {
		return value
			.split('_')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	return value.charAt(0).toUpperCase() + value.slice(1);
};
