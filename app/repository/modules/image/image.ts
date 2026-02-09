import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { UploadImageResp } from './models/response/upload-image.resp';
import type { UploadImagesResp } from './models/response/upload-images.resp';

const ALLOWED_MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence'] as const;

export const IMAGE_FORMAT_ERROR_MESSAGE = 'Unsupported image format. Allowed: JPG, JPEG, PNG, HEIC';

function assertAllowedImageFormat(file: File): void {
	const mime = file.type.toLowerCase();
	if (!ALLOWED_MIME_TYPES.includes(mime as (typeof ALLOWED_MIME_TYPES)[number])) {
		throw new Error(IMAGE_FORMAT_ERROR_MESSAGE);
	}
}

class ImageModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Images;

	async upload(file: File, dir: string): Promise<UploadImageResp> {
		assertAllowedImageFormat(file);
		const formData = new FormData();
		formData.append('file', file);
		formData.append('dir', dir);

		return await this.call<UploadImageResp>({
			method: 'POST',
			url: `${this.RESOURCE.Upload()}`,
			body: formData,
		});
	}

	async uploadMultiple(files: File[], dir: string): Promise<UploadImagesResp> {
		files.forEach(assertAllowedImageFormat);
		const formData = new FormData();
		files.forEach((file) => {
			formData.append('files', file);
		});
		formData.append('dir', dir);

		return await this.call<UploadImagesResp>({
			method: 'POST',
			url: `${this.RESOURCE.UploadMultiple()}`,
			body: formData,
		});
	}
}

export default ImageModule;
