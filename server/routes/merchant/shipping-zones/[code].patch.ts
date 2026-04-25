import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const code = getRouterParams(event).code;
		if (!code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Shipping zone code is required',
			});
		}
		const body = await readBody(event);
		const result = await signedFetch(event, Routes.ShippingZones.Update(code), {
			method: 'PATCH',
			body,
		});
		return result;
	} catch (err) {
		return err;
	}
});
