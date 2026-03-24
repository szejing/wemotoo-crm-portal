import { removeNullValues } from '~/utils/utils';

/** Nuxt auto-imports this for some repository modules (e.g. product-brand). */
(globalThis as Record<string, unknown>).removeNullValues = removeNullValues;

export type FetchCall = { url: string; opts: Record<string, unknown> };

export const fetchLog: FetchCall[] = [];

export function resetFetchMock(): void {
	fetchLog.length = 0;
	(globalThis as unknown as { $fetch: typeof $fetch }).$fetch = (async (url: string, opts?: Record<string, unknown>) => {
		fetchLog.push({ url, opts: opts ?? {} });
		return {};
	}) as typeof $fetch;
}

resetFetchMock();

export function lastFetch(): FetchCall {
	return fetchLog[fetchLog.length - 1]!;
}
