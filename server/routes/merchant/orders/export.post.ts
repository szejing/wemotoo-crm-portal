import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);

		// Fetch CSV as blob/text
		const result = await signedFetch(event, `${Routes.Orders.Export()}`, {
			method: 'POST',
			query,
			responseType: 'blob', // This tells $fetch to treat response as blob
		});

		// Set response headers to trigger download
		setHeader(event, 'Content-Type', 'text/csv');
		setHeader(event, 'Content-Disposition', 'attachment; filename="orders.csv"');

		return result;
	} catch (err) {
		return err;
	}
});
