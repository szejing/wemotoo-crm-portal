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

	console.log('value', value);
	// Convert cents into hundreds.
	value = value / 100;

	// Format the number to the specified fraction digits
	const formattedValue = value.toFixed(fractionDigits);

	console.log('formattedValue', formattedValue);
	return formattedValue;
}

export const capitalizeFirstLetter = (value: string) => {
	return value.charAt(0).toUpperCase() + value.slice(1);
};
