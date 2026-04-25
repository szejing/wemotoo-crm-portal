import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const id = getRouterParams(event).id;

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Shipping Method Id is required',
			});
		}

		const result = await signedFetch(event, Routes.ShippingMethods.Single(id), {
			method: 'GET',
			query,
		});
		return result;
	} catch (err) {
		return err;
	}
});
