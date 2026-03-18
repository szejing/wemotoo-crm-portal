import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Appointment Code is required',
			});
		}

		const result = await signedFetch(event, `${Routes.Appoinments.GetByCustomer(id)}`, {
			method: 'GET',
			body: data,
		});
		return result;
	} catch (err) {
		return err;
	}
});
