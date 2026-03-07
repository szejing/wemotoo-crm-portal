import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const order_no = getRouterParams(event).order_no;

		const result = await signedFetch(event, `${Routes.Orders.Single(order_no)}`, {
			method: 'GET',
			});
		return result;
	} catch (err) {
		return err;
	}
});
