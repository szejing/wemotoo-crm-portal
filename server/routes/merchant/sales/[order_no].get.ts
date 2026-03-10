import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const order_no = getRouterParams(event).order_no;

		if (!order_no) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Order No is required',
			});
		}

		const result = await signedFetch(event, `${Routes.Sales.Single(order_no)}`, {
			method: 'GET',
		});
		return result;
	} catch (err) {
		return err;
	}
});
