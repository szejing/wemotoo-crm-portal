import { joinURL } from 'ufo';
import { Routes } from '../routes.server';

export default defineEventHandler(async (event) => {
	const coreUrl = useRuntimeConfig().NUXT_BASE_URL_JSON_PLACEHOLDER_SERVER;
	const externalUrl = useRuntimeConfig().NUXT_BASE_URL_ANOTHER_SERVER;

	let path = '';
	let target = '';
	/*
	 * Case: /api
	 * */
	if (event.path.startsWith(Routes.core.name)) {
		path = event.path.replace(Routes.core.name, '');
		target = joinURL(coreUrl, path);
	} else if (event.path.startsWith(Routes.external.name)) {
		/*
		 * Case: /api/external
		 * */
		path = event.path.replace(Routes.external.regex, '');
		target = joinURL(externalUrl, path);
	}

	return proxyRequest(event, target);
});
