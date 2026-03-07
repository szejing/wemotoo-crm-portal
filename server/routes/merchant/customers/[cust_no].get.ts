import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const cust_no = getRouterParams(event).cust_no;

		const result = await signedFetch(event, `${Routes.Customers.Single(cust_no)}`, {
			method: 'GET',
			});
		return result;
	} catch (err) {
		return err;
	}
});
