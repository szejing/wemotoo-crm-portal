import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const order_no = getRouterParams(event).order_no;
		const body = await readBody(event);

		const result = await signedFetch(event, Routes.Fulfillment.MarkPacked(order_no), {
			method: 'PATCH',
			body,
		});
		return result;
	} catch (err) {
		return err;
	}
});
