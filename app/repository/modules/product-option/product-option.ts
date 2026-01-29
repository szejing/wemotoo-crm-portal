import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateProductOptionReq } from './models/request/create-product-option.req';
import type { ProductOptionReq } from './models/request/product-option.req';
import type { UpdateProductOptionReq } from './models/request/update-product-option.req';
import type { ProductOptionResp } from './models/response/product-option.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { ProductOption } from '~/utils/types/product-option';

class ProductOptionModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.ProdOptions;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<ProductOption>> {
		return await this.call<BaseODataResp<ProductOption>>({
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

export default ProductOptionModule;
