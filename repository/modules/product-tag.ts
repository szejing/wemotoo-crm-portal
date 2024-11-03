import type { ProductTag } from '~/utils/types/product-tag';
import HttpFactory from '../factory';
import Routes from '../routes.client';

export type ProductTagsResp = {
	count: number;
	productTags: ProductTag[];
};

export type CreateProductTagReq = {
	value: string;
};

export type CreateProductTagResp = {
	productTag: ProductTag;
};

export type DeleteProductTagReq = {
	id: number;
};

export type DeleteProductTagResp = {
	productTag: number;
};

class ProductTagModule extends HttpFactory {
	private RESOURCE = Routes.ProductTag;

	async fetchMany(): Promise<ProductTagsResp> {
		return await this.call<ProductTagsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async fetchSingle(id: string) {
		return await this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(id)}`,
		});
	}

	async create(tag: CreateProductTagReq): Promise<CreateProductTagResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: tag,
		});
	}

	async delete(tag: DeleteProductTagReq): Promise<DeleteProductTagResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete()}`,
			query: tag,
		});
	}
}

export default ProductTagModule;
