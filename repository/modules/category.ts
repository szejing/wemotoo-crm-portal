import type { Category } from '~/utils/types/category';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';

type BaseCategoryReq = {
	code: string;
};

type CategoryResp = {
	category: Category;
};

type CategoriesResp = {
	count: number;
	categories: Category[];
};

type CreateCategoryReq = {
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

type UpdateCategoryReq = {
	name: string | null;
	description: string | null;
	slug: string | null;
	is_internal: boolean | null;
	is_active: boolean | null;
	images: string[] | null;
	thumbnail: string | null;
	parent_category_code: string | null;
};

class CategoryModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Categories;

	async fetchMany(): Promise<CategoriesResp> {
		return this.call<CategoriesResp>({
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

	async create(category: CreateCategoryReq): Promise<CategoryResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: category,
		});
	}

	async update(code: string, category: UpdateCategoryReq): Promise<CategoryResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: removeNullValues(category),
		});
	}

	async delete(category: BaseCategoryReq): Promise<CategoryResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(category.code)}`,
		});
	}

	async restore(category: BaseCategoryReq): Promise<CategoryResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(category.code)}`,
		});
	}
}

export default CategoryModule;
