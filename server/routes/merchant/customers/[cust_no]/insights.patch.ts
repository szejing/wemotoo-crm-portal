import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const cust_no = getRouterParams(event).cust_no;
		const body = await readBody(event);

		if (!cust_no) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Customer no is required',
			});
		}

		const result = await signedFetch(event, Routes.Customers.UpdateInsights(cust_no), {
			method: 'PATCH',
			body,
		});
		return result;
	} catch (err) {
		return err;
	}
});
