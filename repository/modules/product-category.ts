import type { ProductCategory } from '~/utils/types/product-category';
import HttpFactory from '../factory';
import Routes from '../routes.client';

export type ProductCategoriesResp = {
	count: number;
	productCategories: ProductCategory[];
};

export type CreateProductCategoryReq = {
	id: string;
	name: string;
	description: string | null;
	slug: string | null;
	is_internal: boolean | null;
	is_active: boolean | null;
	images: string[] | null;
	thumbnail: string | null;
	parent_category_id: string | null;
};

export type CreateProductCategoryResp = {
	productCategory: ProductCategory;
};

export type DeleteProductCategoryReq = {
	id: string;
};

export type DeleteProductCategoryResp = {
	category_id: string;
};

export type UpdateProductCategoryReq = {
	name: string | null;
	description: string | null;
	slug: string | null;
	is_internal: boolean | null;
	is_active: boolean | null;
	images: string[] | null;
	thumbnail: string | null;
	parent_category_id: string | null;
};

export type UpdateProductCategoryResp = {
	productCategory: ProductCategory;
};

class ProductCategoryModule extends HttpFactory {
	private RESOURCE = Routes.ProdCategory;

	async fetchMany(): Promise<ProductCategoriesResp> {
		return this.call<ProductCategoriesResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async fetchSingle(id: string) {
		return this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(id)}`,
		});
	}

	async create(category: CreateProductCategoryReq): Promise<CreateProductCategoryResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: category,
		});
	}

	async update(id: string, category: UpdateProductCategoryReq): Promise<UpdateProductCategoryResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update()}`,
			query: { id },
			body: removeNullValues(category),
		});
	}

	async delete(category: DeleteProductCategoryReq): Promise<DeleteProductCategoryResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete()}`,
			query: category,
		});
	}
}

export default ProductCategoryModule;
