import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { UploadImageResp } from './models/response/upload-image.resp';
import type { UploadImagesResp } from './models/response/upload-images.resp';

class ImageModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Images;

	async upload(file: File, dir: string): Promise<UploadImageResp> {
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
