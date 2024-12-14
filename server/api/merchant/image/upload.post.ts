import { generateImageHeaders } from './../../../base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const formData = await readFormData(event);
		const file = formData.get('file');
		const name = formData.get('name');
		const type = formData.get('type');
		if (!file || !(file instanceof File)) {
			throw createError({
				statusCode: 400,
				statusMessage: 'File is required and must be a valid file',
			});
		}

		const newFormData = new FormData();
		const blob = new Blob([file], { type: file.type });
		newFormData.append('name', name as string);
		newFormData.append('type', type as string);
		newFormData.append('file', blob, file.name);

		const result = await $fetch(`${Routes.Image.Upload()}`, {
			baseURL: config.public.baseUrl,
			method: 'POST',
			body: newFormData,
			headers: generateImageHeaders(event),
		});
		return result;
	} catch (err) {
		return err;
	}
});
