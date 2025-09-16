import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);
		const order_no = getRouterParams(event).order_no;

		const result = await $fetch(`${Routes.Orders.UpdateOrderPayments(order_no)}`, {
			baseURL: config.public.baseUrl,
			method: 'PATCH',
			headers: generateHeaders(event, true),
			body: data,
		});
		return result;
	} catch (err) {
		return err;
	}
});
