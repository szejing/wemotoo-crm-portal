import { signedFetch } from '#root/server/base_api';
import { Routes } from '#root/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const id = getRouterParams(event).id;
		const result = await signedFetch(event, Routes.Shipment.Delete(id), {
			method: 'DELETE',
		});
		return result;
	} catch (err) {
		return err;
	}
});
