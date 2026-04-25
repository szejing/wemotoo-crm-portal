/** 12h labels used by ZSelectMenuTime (hourly, :00 only), index 0 = 12.00 am … index 23 = 11.00 pm. */
export const HOUR_SELECT_LABELS = [
	'12.00 am',
	'01.00 am',
	'02.00 am',
	'03.00 am',
	'04.00 am',
	'05.00 am',
	'06.00 am',
	'07.00 am',
	'08.00 am',
	'09.00 am',
	'10.00 am',
	'11.00 am',
	'12.00 pm',
	'01.00 pm',
	'02.00 pm',
	'03.00 pm',
	'04.00 pm',
	'05.00 pm',
	'06.00 pm',
	'07.00 pm',
	'08.00 pm',
	'09.00 pm',
	'10.00 pm',
	'11.00 pm',
] as const;

/** Normalize to HHmm (e.g. "0900", "1900"). Accepts 3-digit (→ 0Hmm) or 1–2 digit hour (→ HH00). */
export function normalizeToHhmm(raw: string): string | null {
	const digits = raw.trim().replace(/\D/g, '');
	if (!digits) return null;
	let four: string;
	if (digits.length === 4) four = digits;
	else if (digits.length === 3) four = '0' + digits;
	else if (digits.length <= 2) four = digits.padStart(2, '0') + '00';
	else return null;
	const h = Number(four.slice(0, 2));
	const m = Number(four.slice(2, 4));
	if (h > 23 || m > 59) return null;
	return four;
}

/** API / merchant 24h "0900" → dropdown label "09.00 am". */
export function hhmmToSelectLabel(hhmm: string): string {
	const n = normalizeToHhmm(hhmm);
	if (!n) {
		// already a display label
		return HOUR_SELECT_LABELS.includes(hhmm as (typeof HOUR_SELECT_LABELS)[number]) ? hhmm : '';
	}
	const h = Number(n.slice(0, 2));
	return HOUR_SELECT_LABELS[h] ?? '';
}

/** Dropdown label → HHmm for API. */
export function selectLabelToHhmm(label: string): string | null {
	const i = HOUR_SELECT_LABELS.indexOf(label as (typeof HOUR_SELECT_LABELS)[number]);
	if (i < 0) return null;
	return `${String(i).padStart(2, '0')}00`;
}
