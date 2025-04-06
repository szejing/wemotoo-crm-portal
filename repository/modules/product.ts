import type { ProdOptionInput, Product, ProdVariantInput } from '~/utils/types/product';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';
import type { ProductStatus } from 'wemotoo-common';
import type { PriceInput } from '~/utils/types/price';
import type { CategoryInput } from '~/utils/types/category';
import type { TagInput } from '~/utils/types/tag';

type BaseProductReq = {
	code: string;
};

type ProductResp = {
	product: Product;
};

type ProductsResp = {
	count: number;
	products: Product[];
};

type CreateProductReq = {
	code?: string | undefined;
	name: string | undefined;
	short_desc: string | undefined;
	long_desc: string | undefined;
	is_discountable: boolean;
	is_giftcard: boolean;
	is_active: boolean;

	status: ProductStatus;

	// categories
	categories: CategoryInput[] | undefined;

	// tags
	tags: TagInput[] | undefined;

	// thumbnail
	thumbnail: string | undefined;

	// galleries
	galleries: string[] | undefined;

	// price
	price_types: PriceInput[] | undefined;

	// variants
	options: ProdOptionInput[] | undefined;
	variants: ProdVariantInput[] | undefined;

	// type
	type: number;
};

type CreateProductResp = {
	count: number;
	products: Product[];
};

type UpdateProductReq = CreateProductReq;

class ProductModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Products;

	async fetchMany(): Promise<ProductsResp> {
		return await this.call<ProductsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async fetchSingle(code: string) {
		return await this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(code)}`,
		});
	}

	async create(product: CreateProductReq): Promise<CreateProductResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: product,
		});
	}

	async update(code: string, product: UpdateProductReq): Promise<ProductResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: product,
		});
	}

	async delete(product: BaseProductReq): Promise<ProductResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(product.code)}`,
		});
	}

	async restore(product: BaseProductReq): Promise<ProductResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(product.code)}`,
		});
	}
}

export default ProductModule;
