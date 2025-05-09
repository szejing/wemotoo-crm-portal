import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateProductCategoryReq } from './models/request/create-product-category.req';
import type { ProductCategoryReq } from './models/request/product-category.req';
import type { UpdateProductCategoryReq } from './models/request/update-product-category.req';
import type { ProductCategoriesResp } from './models/response/product-categories.resp';
import type { ProductCategoryResp } from './models/response/product-category.resp';

class ProductCategoryModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.ProductCategories;

	async fetchMany(): Promise<ProductCategoriesResp> {
		return this.call<ProductCategoriesResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async fetchSingle(code: string) {
		return this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(code)}`,
		});
	}

	async create(category: CreateProductCategoryReq): Promise<ProductCategoryResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: category,
		});
	}

	async update(code: string, category: UpdateProductCategoryReq): Promise<ProductCategoryResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: removeNullValues(category),
		});
	}

	async delete(category: ProductCategoryReq): Promise<ProductCategoryResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(category.code)}`,
		});
	}

	async restore(category: ProductCategoryReq): Promise<ProductCategoryResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(category.code)}`,
		});
	}
}

export default ProductCategoryModule;
