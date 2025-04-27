import type { Category } from '~/utils/types/category';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';

type BaseProductCategoryReq = {
	code: string;
};

type ProductCategoryResp = {
	category: Category;
};

type ProductCategoriesResp = {
	count: number;
	categories: Category[];
};

type CreateProductCategoryReq = {
	code: string;
	name: string;
	description: string | null;
	slug: string | null;
	is_internal: boolean | null;
	is_active: boolean | null;
	images: string[] | null;
	thumbnail: string | null;
	parent_category_code: string | null;
};

type UpdateProductCategoryReq = {
	name: string | null;
	description: string | null;
	slug: string | null;
	is_internal: boolean | null;
	is_active: boolean | null;
	images: string[] | null;
	thumbnail: string | null;
	parent_category_code: string | null;
};

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

	async delete(category: BaseProductCategoryReq): Promise<ProductCategoryResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(category.code)}`,
		});
	}

	async restore(category: BaseProductCategoryReq): Promise<ProductCategoryResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(category.code)}`,
		});
	}
}

export default ProductCategoryModule;
