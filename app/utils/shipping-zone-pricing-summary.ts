/** Parses store-built `pricing_summary` (`"MethodA: 10 · MethodB: 0"`). */
export function parsePricingSummarySegments(summary: string): { label: string; fee: number }[] {
	const trimmed = summary.trim();
	if (!trimmed) return [];
	return trimmed.split(/\s*·\s*/).map((segment) => {
		const s = segment.trim();
		if (!s) return { label: '', fee: 0 };
		const colon = s.indexOf(': ');
		if (colon === -1) {
			const n = Number(s);
			return { label: '', fee: Number.isFinite(n) ? n : 0 };
		}
		const label = s.slice(0, colon).trim();
		const feeRaw = s.slice(colon + 2).trim();
		const fee = Number(feeRaw);
		return { label, fee: Number.isFinite(fee) ? fee : 0 };
	});
}
