import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';
import { decodebase64 } from 'wemotoo-common';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);

		const decryptedToken = decodebase64(data.token);
		const payload = JSON.parse(decryptedToken);
		const token = payload.token;

		const result = await signedFetch(event, `${Routes.Auth.PasswordResetValidate()}`, {
			method: 'POST',
			body: { token },
		});
		return result;
	} catch (err) {
		return err;
	}
});
