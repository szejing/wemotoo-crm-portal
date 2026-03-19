import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const customer_no = getRouterParams(event).customer_no;
		const query = getQuery(event);

		if (!customer_no) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Customer No is required',
			});
		}

		const result = await signedFetch(event, `${Routes.Appoinments.GetByCustomer(customer_no)}`, {
			method: 'GET',
			query,
		});
		return result;
	} catch (err) {
		return err;
	}
});
