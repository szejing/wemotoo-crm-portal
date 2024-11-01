import type { ProductTag } from '~/utils/types/product-tag';
import HttpFactory from '../factory';
import Routes from '../routes.client';

export type ProductTagsResp = {
	count: number;
	productTags: ProductTag[];
};

class ProductTagModule extends HttpFactory {
	private RESOURCE = Routes.ProductTag;
	private accessToken: string = '';

	async fetchMany(): Promise<ProductTagsResp> {
		return this.call<ProductTagsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async fetchSingle(id: string) {
		return this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(id)}`,
		});
	}

	// async createPost(dto: IPost) {
	// 	return this.call<IPost>({
	// 		method: 'POST',
	// 		url: `${this.RESOURCE.CreatePost()}`,
	// 		body: dto,
	// 		fetchOptions: {
	// 			headers: {
	// 				...(this.accessToken
	// 					? {
	// 							'Authorization': `Bearer ${this.accessToken}`,
	// 					  }
	// 					: {}),
	// 			},
	// 		},
	// 	});
	// }
	// async fetchDetail(id: number) {
	// 	return this.call<IPost>({
	// 		method: 'GET',
	// 		url: `${this.RESOURCE.FetchDetail(id)}`,
	// 		fetchOptions: {
	// 			headers: {
	// 				...(this.accessToken
	// 					? {
	// 							'Authorization': `Bearer ${this.accessToken}`,
	// 					  }
	// 					: {}),
	// 			},
	// 		},
	// 	});
	// }

	setAccessToken(accessToken: string) {
		this.accessToken = accessToken;
	}
}

export default ProductTagModule;
