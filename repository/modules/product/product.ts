import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateProductReq } from './models/request/create-product.req';
import type { ProductReq } from './models/request/product.req';
import type { UpdateProductReq } from './models/request/update-product.req';
import type { CreateProductResp } from './models/response/create-product.resp';
import type { ProductResp } from './models/response/product.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Product } from '~/utils/types/product';

class ProductModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Products;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<Product>> {
		return await this.call<BaseODataResp<Product>>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	async getSingle(code: string): Promise<ProductResp> {
		return await this.call<ProductResp>({
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

	async delete(product: ProductReq): Promise<ProductResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(product.code)}`,
		});
	}

	async deleteVariant(code: string, variant_code: string): Promise<ProductResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.DeleteVariant(code, variant_code)}`,
		});
	}

	async restore(product: ProductReq): Promise<ProductResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(product.code)}`,
		});
	}
}

export default ProductModule;
