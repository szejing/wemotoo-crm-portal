/** When false, shipping zone forms hide country + postcode (Malaysia-only state picker). */
export const SHIPPING_ZONE_SHOW_COUNTRY_AND_POSTCODE_FIELDS = false;

export type MalaysiaStateOption = { label: string; value: string };

/** 13 states + 3 federal territories (English labels, stored as `state` on the zone). */
export const MALAYSIA_STATE_OPTIONS: MalaysiaStateOption[] = [
	{ label: 'Johor', value: 'Johor' },
	{ label: 'Kedah', value: 'Kedah' },
	{ label: 'Kelantan', value: 'Kelantan' },
	{ label: 'Melaka', value: 'Melaka' },
	{ label: 'Negeri Sembilan', value: 'Negeri Sembilan' },
	{ label: 'Pahang', value: 'Pahang' },
	{ label: 'Pulau Pinang', value: 'Pulau Pinang' },
	{ label: 'Perak', value: 'Perak' },
	{ label: 'Perlis', value: 'Perlis' },
	{ label: 'Sabah', value: 'Sabah' },
	{ label: 'Sarawak', value: 'Sarawak' },
	{ label: 'Selangor', value: 'Selangor' },
	{ label: 'Terengganu', value: 'Terengganu' },
	{ label: 'Wilayah Persekutuan Kuala Lumpur', value: 'Wilayah Persekutuan Kuala Lumpur' },
	{ label: 'Wilayah Persekutuan Labuan', value: 'Wilayah Persekutuan Labuan' },
	{ label: 'Wilayah Persekutuan Putrajaya', value: 'Wilayah Persekutuan Putrajaya' },
];

/** Multiple states are stored in API `state` joined by `|` (names do not contain `|`). */
export const MALAYSIA_STATES_API_DELIMITER = '|';

export function parseStatesFromApi(value: string | undefined): string[] {
	if (!value?.trim()) {
		return [];
	}
	return value
		.split(MALAYSIA_STATES_API_DELIMITER)
		.map((s) => s.trim())
		.filter(Boolean);
}

export function serializeStatesForApi(states: string[]): string | undefined {
	const cleaned = states.map((s) => s.trim()).filter(Boolean);
	if (!cleaned.length) {
		return undefined;
	}
	return cleaned.join(MALAYSIA_STATES_API_DELIMITER);
}

export function mergeMalaysiaStateOptions(currentValues: string[]): MalaysiaStateOption[] {
	const base = [...MALAYSIA_STATE_OPTIONS];
	const extras = currentValues
		.map((s) => s.trim())
		.filter(Boolean)
		.filter((s) => !base.some((o) => o.value === s))
		.map((s) => ({ label: s, value: s }));
	return [...extras, ...base];
}
