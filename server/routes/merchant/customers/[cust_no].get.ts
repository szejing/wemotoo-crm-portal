import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const cust_no = getRouterParams(event).cust_no;

		if (!cust_no) {
			throw createError({
				status: 400,
				message: 'Customer no is required',
			});
		}

		const result = await signedFetch(event, `${Routes.Customers.Single(cust_no)}`, {
			method: 'GET',
		});
		return result;
	} catch (err) {
		return err;
	}
});
