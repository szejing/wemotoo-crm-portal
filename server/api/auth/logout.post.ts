import BaseUrl from '~/utils/https/base-url';
import Path from '~/utils/path';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);
		// const headers = event.headers;
		const result = await $fetch(`${Path.logout}`, {
			baseURL: BaseUrl.prod,
			method: 'POST',
			body: data,
			// headers: headers,
		});
		return result;
	} catch (err) {
		return err;
	} finally {
	}
});
