import type { Category } from '~/utils/types/category';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';

export type CategoriesResp = {
	count: number;
	categories: Category[];
};

export type CreateCategoryReq = {
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

export type CreateCategoryResp = {
	category: Category;
};

export type DeleteCategoryReq = {
	code: string;
};

export type DeleteCategoryResp = {
	category: Category;
};

export type UpdateCategoryReq = {
	name: string | null;
	description: string | null;
	slug: string | null;
	is_internal: boolean | null;
	is_active: boolean | null;
	images: string[] | null;
	thumbnail: string | null;
	parent_category_code: string | null;
};

export type UpdateCategoryResp = {
	category: Category;
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

	async create(category: CreateCategoryReq): Promise<CreateCategoryResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: category,
		});
	}

	async update(code: string, category: UpdateCategoryReq): Promise<UpdateCategoryResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: removeNullValues(category),
		});
	}

	async delete(category: DeleteCategoryReq): Promise<DeleteCategoryResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(category.code)}`,
		});
	}
}

export default CategoryModule;
