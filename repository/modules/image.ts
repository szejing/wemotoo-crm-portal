import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';

export type ImageUploadResp = {
	id: number;
	url: string;
};

export type SingleImageUploadResp = {
	image: ImageUploadResp;
};

class ImageModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Image;

	async upload(file: File, name: string, type: string): Promise<SingleImageUploadResp> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('name', name);
		formData.append('type', type);

		return await this.call<SingleImageUploadResp>({
			method: 'POST',
			url: `${this.RESOURCE.Upload()}`,
			body: formData,
		});
	}
}

export default ImageModule;
