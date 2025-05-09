import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateProductTagReq } from './models/request/create-product-tag.req';
import type { UpdateProductTagReq } from './models/request/update-product-tag.req';
import type { ProductTagResp } from './models/response/product-tag.resp';
import type { ProductTagsResp } from './models/response/product-tags.resp';
import type { ProductTagReq } from './models/request/product-tag.req';

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

	async delete(tag: ProductTagReq): Promise<ProductTagResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(tag.id)}`,
		});
	}

	async restore(tag: ProductTagReq): Promise<ProductTagResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(tag.id)}`,
		});
	}
}

export default ProductTagModule;
