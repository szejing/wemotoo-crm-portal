import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';
import { decodebase64 } from 'wemotoo-common';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);

		const decryptedToken = decodebase64(data.token);
		const payload = JSON.parse(decryptedToken);
		const merchant_id = payload.merchant_id;
		const token = payload.token;

		const result = await signedFetch(event, `${Routes.Auth.PasswordResetConfirm()}`, {
			method: 'POST',
			body: { token, new_password: data.password },
			});
		return result;
	} catch (err) {
		return err;
	}
});
