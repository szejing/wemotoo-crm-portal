export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const data = await readBody(event);

		const result = await $fetch(`${'Path.login'}`, {
			baseURL: config.baseUrl,
			method: 'POST',
			body: data,
			headers: {
				Accept: 'application/json',
			},
		});
		return result;
	} catch (err) {
		return err;
	}
});
