import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateProductCategoryReq } from './models/request/create-product-category.req';
import type { ProductCategoryReq } from './models/request/product-category.req';
import type { UpdateProductCategoryReq } from './models/request/update-product-category.req';
import type { ProductCategoryResp } from './models/response/product-category.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Category } from '~/utils/types/category';

class ProductCategoryModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.ProductCategories;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<Category>> {
		return this.call<BaseODataResp<Category>>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	async getSingle(code: string): Promise<ProductCategoryResp> {
		return this.call<ProductCategoryResp>({
			method: 'GET',
			url: `${this.RESOURCE.Single(code)}`,
		});
	}

	async create(category: CreateProductCategoryReq): Promise<ProductCategoryResp> {
		return await this.call<ProductCategoryResp>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: category,
		});
	}

	async update(code: string, category: UpdateProductCategoryReq): Promise<ProductCategoryResp> {
		return await this.call<ProductCategoryResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: category,
		});
	}

	async delete(category: ProductCategoryReq): Promise<ProductCategoryResp> {
		return await this.call<ProductCategoryResp>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(category.code)}`,
		});
	}

	async restore(category: ProductCategoryReq): Promise<ProductCategoryResp> {
		return await this.call<ProductCategoryResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(category.code)}`,
		});
	}
}

export default ProductCategoryModule;
