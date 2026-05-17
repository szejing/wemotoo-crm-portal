import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const result = await signedFetch(event, `${Routes.Notifications.Many()}`, {
			method: 'GET',
		});
		return result;
	} catch (err) {
		return err;
	}
});
