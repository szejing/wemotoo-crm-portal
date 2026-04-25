import { getQuery } from 'h3';
import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const result = await signedFetch(event, Routes.ShippingMethods.Resolve(), {
			method: 'GET',
			query: query as Record<string, string>,
		});
		return result;
	} catch (err) {
		return err;
	}
});
