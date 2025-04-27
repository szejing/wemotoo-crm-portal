import type { Tag } from '~/utils/types/tag';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';

type BaseProductTagReq = {
	id: number;
};

type ProductTagResp = {
	tag: Tag;
};

type ProductTagsResp = {
	count: number;
	tags: Tag[];
};

type CreateProductTagReq = {
	value: string;
};

type UpdateProductTagReq = {
	value: string;
	metadata?: Record<string, unknown> | undefined;
};

class ProductTagModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.ProductTags;

	async fetchMany(): Promise<ProductTagsResp> {
		return await this.call<ProductTagsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async fetchSingle(id: number) {
		return await this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(id)}`,
		});
	}

	async create(tag: CreateProductTagReq): Promise<ProductTagResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: tag,
		});
	}

	async update(id: number, tag: UpdateProductTagReq): Promise<ProductTagResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(id)}`,
			body: tag,
		});
	}

	async delete(tag: BaseProductTagReq): Promise<ProductTagResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(tag.id)}`,
		});
	}

	async restore(tag: BaseProductTagReq): Promise<ProductTagResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(tag.id)}`,
		});
	}
}

export default ProductTagModule;
