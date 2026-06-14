export function normalizeAmount(v: string): number {
	const normalized = v.trim().replace(',', '.');
	const num = parseFloat(normalized);
	return Number.isNaN(num) ? 0 : num;
}
