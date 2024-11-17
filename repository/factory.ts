import type { $Fetch, NitroFetchOptions } from 'nitropack';
import { ApiErrorModel } from '~/utils/types/api-error-model';

interface IHttpFactory {
	method:
		| 'GET'
		| 'HEAD'
		| 'PATCH'
		| 'POST'
		| 'PUT'
		| 'DELETE'
		| 'CONNECT'
		| 'OPTIONS'
		| 'TRACE'
		| 'get'
		| 'head'
		| 'patch'
		| 'post'
		| 'put'
		| 'delete'
		| 'connect'
		| 'options'
		| 'trace';
	url: string;
	fetchOptions?: NitroFetchOptions<'json'>;
	body?: object;
	query?: object;
	headers?: Record<string, string>;
}

class HttpFactory {
	private readonly $fetch: $Fetch;

	constructor(fetch: $Fetch) {
		this.$fetch = fetch;
	}

	async call<T>({
		method,
		url,
		fetchOptions,
		body,
		query,
		headers = {
			'Content-Type': 'application/json',
		},
	}: IHttpFactory): Promise<T> {
		try {
			return await this.$fetch<T>(url, {
				method,
				body,
				query,
				...fetchOptions,
				...headers,
			});
		} catch (error: any) {
			throw error.data?.data ? error.data?.data : new ApiErrorModel(500, 'Internal Server Error');
		}
	}
}
export default HttpFactory;
