import type { ProdCategoryInput, ProdOptionInput, ProdTagInput, Product, ProdVariantInput } from '~/utils/types/product';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';
import type { ProductStatus } from '~/utils/enum/product-status';
import type { ProductPrice } from '~/utils/types/product-price';

export type ProductsResp = {
	count: number;
	products: Product[];
};

export type CreateProductReq = {
	code: string | undefined;
	name: string | undefined;
	short_desc: string | undefined;
	long_desc: string | undefined;
	is_discountable: boolean;
	is_giftcard: boolean;
	is_active: boolean;

	status: ProductStatus;

	// categories
	categories: ProdCategoryInput[] | undefined;

	// tags
	tags: ProdTagInput[] | undefined;

	// thumbnail
	thumbnail: string | undefined;

	// galleries
	galleries: string[] | undefined;

	// price
	price_types: ProductPrice[] | undefined;

	// variants
	options: ProdOptionInput[] | undefined;
	variants: ProdVariantInput[] | undefined;
};

export type CreateProductResp = {
	count: number;
	products: Product[];
	product: Product;
};

export type DeleteProductReq = {
	code: string;
};

export type DeleteProductResp = {
	code: string;
};

export type UpdateProductReq = CreateProductReq;

export type UpdateProductResp = {
	product: Product;
};

class ProductModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Product;

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

	async update(code: string, product: UpdateProductReq): Promise<UpdateProductResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update()}`,
			query: { code },
			body: product,
		});
	}

	async delete(product: DeleteProductReq): Promise<DeleteProductResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete()}`,
			query: product,
		});
	}
}

export default ProductModule;
