import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const bill_no = getRouterParams(event).bill_no;

		const result = await signedFetch(event, `${Routes.Sales.Single(bill_no)}`, {
			method: 'GET',
			});
		return result;
	} catch (err) {
		return err;
	}
});
