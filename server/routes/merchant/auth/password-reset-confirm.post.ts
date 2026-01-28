import { generateHeaders } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';
import { decodebase64 } from 'wemotoo-common';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);

		const decryptedToken = decodebase64(data.token);
		const payload = JSON.parse(decryptedToken);
		const merchant_id = payload.merchant_id;
		const token = payload.token;

		const result = await $fetch(`${Routes.Auth.PasswordResetConfirm()}`, {
			baseURL: config.public.baseUrl,
			method: 'POST',
			body: { token, new_password: data.password },
			headers: generateHeaders(event, false, merchant_id),
		});
		return result;
	} catch (err) {
		return err;
	}
});
