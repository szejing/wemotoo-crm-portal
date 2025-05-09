import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { UploadImageResp } from './models/response/upload-image.resp';
import type { UploadImagesResp } from './models/response/upload-images.resp';

class ImageModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Image;

	async upload(file: File, name: string, type: string): Promise<UploadImageResp> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('name', name);
		formData.append('type', type);

		return await this.call<UploadImageResp>({
			method: 'POST',
			url: `${this.RESOURCE.Upload()}`,
			body: formData,
		});
	}

	async uploadMultiple(files: File[], name: string, type: string): Promise<UploadImagesResp> {
		const formData = new FormData();
		files.forEach((file) => {
			formData.append('files', file);
		});
		formData.append('name', name);
		formData.append('type', type);

		return await this.call<UploadImagesResp>({
			method: 'POST',
			url: `${this.RESOURCE.UploadMultiple()}`,
			body: formData,
		});
	}
}

export default ImageModule;
