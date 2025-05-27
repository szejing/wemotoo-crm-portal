import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const cust_no = getRouterParams(event).cust_no;

		const result = await $fetch(`${Routes.Customers.Single(cust_no)}`, {
			baseURL: config.public.baseUrl,
			method: 'GET',
			headers: generateHeaders(event, true),
		});
		return result;
	} catch (err) {
		return err;
	}
});
