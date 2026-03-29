import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);

		const result = await signedFetch(event, `${Routes.Auth.PasswordReset()}`, {
			method: 'POST',
			body: { 'email_address': data.email_address },
		});
		return result;
	} catch (err) {
		return err;
	}
});
