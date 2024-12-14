import { KEY } from '~/utils/constants/key';

export const generateHeaders = (event: any, includeAccessToken: boolean = true, merchant_id: string = '') => {
	const config = useRuntimeConfig(event);

	const cookie_access_token = getCookie(event, KEY.ACCESS_TOKEN) || '';
	const cookie_merchant_id = getCookie(event, KEY.X_MERCHANT_ID) || '';

	const headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'x-api-key': config.public.apiKey,
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
		'x-api-key': config.public.apiKey,
		'x-merchant-id': cookie_merchant_id,
	};

	return {
		...headers,
		Authorization: 'Bearer ' + cookie_access_token,
	};
};
