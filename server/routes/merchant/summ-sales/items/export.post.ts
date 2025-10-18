import { generateHeaders } from '~/server/base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const query = getQuery(event);

		// Fetch CSV as blob/text
		const result = await $fetch(`${Routes.SummSales.ExportItems()}`, {
			baseURL: config.public.baseUrl,
			method: 'POST',
			headers: generateHeaders(event, true),
			query,
			responseType: 'blob', // This tells $fetch to treat response as blob
		});

		// Set response headers to trigger download
		setHeader(event, 'Content-Type', 'text/csv');
		setHeader(event, 'Content-Disposition', 'attachment; filename="summ_sales_items.csv"');

		return result;
	} catch (err) {
		return err;
	}
});
