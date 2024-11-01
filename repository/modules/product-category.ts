import type { ProductCategory } from '~/utils/types/product-category';
import HttpFactory from '../factory';
import Routes from '../routes.client';

export type ProductCategoriesResp = {
	count: number;
	productCategories: ProductCategory[];
};

class ProductCategoryModule extends HttpFactory {
	private RESOURCE = Routes.ProdCategory;
	private accessToken: string = '';

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

	setAccessToken(accessToken: string) {
		this.accessToken = accessToken;
	}
}

export default ProductCategoryModule;
