import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const id = getRouterParams(event).id;
		const data = await readBody(event);

		if (!id) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Shipping Method Id is required',
			});
		}

		const result = await signedFetch(event, Routes.ShippingMethods.Update(id), {
			method: 'PATCH',
			body: data,
		});
		return result;
	} catch (err) {
		return err;
	}
});
