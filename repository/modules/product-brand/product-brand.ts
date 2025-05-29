import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateProductBrandReq } from './models/request/create-product-brand.req';
import type { UpdateProductBrandReq } from './models/request/update-product-brand.req';
import type { ProductBrandsResp } from './models/response/product-brands.resp';
import type { ProductBrandResp } from './models/response/product-brand.resp';
import type { ProductBrandReq } from './models/request/product-brand.req';

class ProductBrandModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.ProductBrands;

	async fetchMany(): Promise<ProductBrandsResp> {
		return this.call<ProductBrandsResp>({
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

	async create(brand: CreateProductBrandReq): Promise<ProductBrandResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: brand,
		});
	}

	async update(code: string, brand: UpdateProductBrandReq): Promise<ProductBrandResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: removeNullValues(brand),
		});
	}

	async delete(brand: ProductBrandReq): Promise<ProductBrandResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(brand.code)}`,
		});
	}

	async restore(brand: ProductBrandReq): Promise<ProductBrandResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(brand.code)}`,
		});
	}
}

export default ProductBrandModule;
