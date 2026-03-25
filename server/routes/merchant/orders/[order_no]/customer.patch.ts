import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);
		const order_no = getRouterParams(event).order_no;

		if (!order_no) {
			throw new Error('Order not found');
		}

		const result = await signedFetch(event, `${Routes.Orders.UpdateOrderCustomer(order_no)}`, {
			method: 'PATCH',
			body: data,
		});
		return result;
	} catch (err) {
		return err;
	}
});
