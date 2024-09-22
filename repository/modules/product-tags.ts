import HttpFactory from '../factory';
import Routes from '../routes.client';

class ProductTagsModule extends HttpFactory {
	private RESOURCE = Routes.ProductTag;
	private accessToken: string = '';

	async fetchAll() {
		return this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.FetchAll()}`,
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

export default ProductTagsModule;
