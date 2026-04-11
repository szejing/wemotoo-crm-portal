export const parseFilterValueCsv = (value?: string): string[] => {
	if (!value) {
		return [];
	}

	return value
		.split(',')
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
};

export const stringifyFilterValueCsv = (values: string[]): string => {
	const uniqueValues = Array.from(
		new Set(
			values
				.map((item) => item.trim())
				.filter((item) => item.length > 0),
		),
	);

	return uniqueValues.join(',');
};
