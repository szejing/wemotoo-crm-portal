import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateProductOptionReq } from './models/request/create-product-variation.req';
import type { ProductOptionReq } from './models/request/product-variation.req';
import type { UpdateProductOptionReq } from './models/request/update-product-variation.req';
import type { ProductOptionResp } from './models/response/product-variation.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { ProductVariation } from '~/utils/types/product-variation';

class ProductVariationModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.ProdVariations;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<ProductVariation>> {
		return await this.call<BaseODataResp<ProductVariation>>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	async getSingle(id: number) {
		return await this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(id)}`,
		});
	}

	async create(option: CreateProductOptionReq): Promise<ProductOptionResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: option,
		});
	}

	async update(id: number, option: UpdateProductOptionReq): Promise<ProductOptionResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(id)}`,
			body: option,
		});
	}

	async delete(option: ProductOptionReq): Promise<ProductOptionResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(option.id)}`,
		});
	}

	async restore(option: ProductOptionReq): Promise<ProductOptionResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(option.id)}`,
		});
	}
}

export default ProductVariationModule;
