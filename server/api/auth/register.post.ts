import BaseUrl from '~/utils/https/base-url';
import Path from '~/utils/path';

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody(event);
		const result = await $fetch(`${Path.register}`, {
			baseURL: BaseUrl.prod,
			method: 'POST',
			body: data,
			headers: {
				Accept: 'application/json',
			},
		});
		return result;
	} catch (err) {
		return err;
	} finally {
	}
});
