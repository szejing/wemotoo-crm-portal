import { KEY, buildCanonicalString, canonicalPathAndQueryFromParts, hashBody, signRequest } from 'wemotoo-common';

const API_PATH_PREFIX = '/api';

function getSignatureHeaders(event: any, method: string, pathForSignature: string, body: string | undefined | null): Record<string, string> {
	const config = useRuntimeConfig(event);
	const secret = config.apiKeySecret || config.apiKey;
	if (!secret) {
		return {};
	}
	const timestamp = new Date().toISOString();
	const bodyHash = hashBody(body ?? undefined);
	const canonical = buildCanonicalString(method, pathForSignature, timestamp, bodyHash);
	const signature = signRequest(canonical, secret);
	return {
		[KEY.X_TIMESTAMP]: timestamp,
		[KEY.X_SIGNATURE]: signature,
	};
}

/**
 * Build canonical path+query as used for X-Signature (path no trailing slash, query keys sorted).
 */
export function pathForSignature(pathSegment: string, query?: Record<string, any>): string {
	const pathname = `${API_PATH_PREFIX}/${pathSegment.replace(/^\//, '').replace(/\/+$/, '')}`;
	return canonicalPathAndQueryFromParts(pathname, query);
}

/**
 * $fetch to ecommerce backend with x-api-key, x-signature, and x-timestamp. Use this for all server-to-backend calls.
 * x-merchant-id is always set: from options.merchant_id, or from options.body.merchant_id, or from cookie.
 */
export async function signedFetch(
	event: any,
	pathSegment: string,
	options: {
		method?: string;
		query?: Record<string, any>;
		body?: any;
		headers?: Record<string, string>;
		includeAccessToken?: boolean;
		merchant_id?: string;
		[key: string]: any;
	} = {},
): Promise<any> {
	const config = useRuntimeConfig(event);
	const baseURL = config.public.baseUrl;
	const method = (options.method || 'GET').toUpperCase();
	const query = options.query ?? {};
	const normalizedSegment = pathSegment.replace(/^\//, '').replace(/^api\//, '').replace(/^merchant\//, '');
	const pathForSig = pathForSignature(normalizedSegment, query);
	const bodyForHash =
		method === 'GET' || method === 'HEAD' || method === 'OPTIONS'
			? undefined
			: options.body === undefined || options.body === null
				? ''
				: typeof options.body === 'string'
					? options.body
					: JSON.stringify(options.body);
	const sigHeaders = getSignatureHeaders(event, method, pathForSig, bodyForHash);
	const cookie_merchant_id = getCookie(event, KEY.X_MERCHANT_ID) || '';
	const merchant_id =
		options.merchant_id != null && options.merchant_id !== ''
			? String(options.merchant_id)
			: options.body != null && typeof options.body === 'object' && options.body.merchant_id != null && options.body.merchant_id !== ''
				? String(options.body.merchant_id)
				: cookie_merchant_id;
	const baseHeaders = generateHeaders(event, options.includeAccessToken !== false, merchant_id);
	const headers = { ...baseHeaders, ...sigHeaders, ...(options.headers || {}) };
	const { includeAccessToken, merchant_id: _omit, method: _method, ...fetchOptions } = options;
	// Request path must match what we signed (/api/...). Avoid double "api" when baseURL already includes /api.
	const basePath = (baseURL || '').replace(/\/+$/, '');
	const baseHasApi = basePath.endsWith('/api');
	const requestPath = baseHasApi ? normalizedSegment : `api/${normalizedSegment}`;
	return $fetch(requestPath, {
		...fetchOptions,
		baseURL,
		method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS',
		headers,
	});
}

export const generateBasicHeaders = (event: any) => {
	const config = useRuntimeConfig(event);

	const headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'x-api-key': config.apiKey,
	};

	return headers;
};

export const generateHeaders = (event: any, includeAccessToken: boolean = true, merchant_id: string = '') => {
	const config = useRuntimeConfig(event);

	const cookie_access_token = getCookie(event, KEY.ACCESS_TOKEN) || '';
	const cookie_merchant_id = getCookie(event, KEY.X_MERCHANT_ID) || '';

	const headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'x-api-key': config.apiKey,
		'x-merchant-id': merchant_id != '' ? merchant_id : cookie_merchant_id,
	};

	if (!includeAccessToken) {
		return headers;
	}

	return {
		...headers,
		Authorization: 'Bearer ' + cookie_access_token,
	};
};

export const generateImageHeaders = (event: any) => {
	const config = useRuntimeConfig(event);

	const cookie_access_token = getCookie(event, KEY.ACCESS_TOKEN) || '';
	const cookie_merchant_id = getCookie(event, KEY.X_MERCHANT_ID) || '';

	const headers = {
		'Accept': 'application/json',
		'x-api-key': config.apiKey,
		'x-merchant-id': cookie_merchant_id,
	};

	return {
		...headers,
		Authorization: 'Bearer ' + cookie_access_token,
	};
};
