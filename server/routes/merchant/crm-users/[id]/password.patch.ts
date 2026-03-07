import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const id = getRouterParams(event).id;
		const body = await readBody(event);

		if (!id) {
			throw createError({ statusCode: 400, statusMessage: 'CRM user id is required' });
		}

		const result = await signedFetch(event, Routes.CrmUsers.UpdatePassword(id), {
			method: 'PATCH',
			body,
		});
		return result;
	} catch (err) {
		return err;
	}
});
