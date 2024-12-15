import { generateImageHeaders } from '../../../base_api';
import { Routes } from '~/server/routes.server';

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig(event);
		const formData = await readFormData(event);
		const files = formData.getAll('files');
		const name = formData.get('name');
		const type = formData.get('type');

		if (!files || !(files instanceof Array)) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Files is required and must be a valid file',
			});
		}
		// Start of Selection
		const newFormData = new FormData();

		newFormData.append('name', name as string);
		newFormData.append('type', type as string);

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (!(file instanceof File)) {
				throw createError({
					statusCode: 400,
					statusMessage: 'File is required and must be a valid file',
				});
			}

			const blob = new Blob([file], { type: file.type });
			newFormData.append('files', blob, file.name);
		}

		const result = await $fetch(`${Routes.Image.UploadMultiple()}`, {
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
