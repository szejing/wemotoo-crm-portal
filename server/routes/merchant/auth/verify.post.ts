import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const result = await signedFetch(event, `${Routes.Auth.Verify()}`, {
			method: 'POST',
		});
		return result;
	} catch (err) {
		return err;
	}
});
