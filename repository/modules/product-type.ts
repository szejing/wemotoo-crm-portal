import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';
import type { ProductType } from '~/utils/types/product-type';

export type ProductTypesResp = {
	count: number;
	productTypes: ProductType[];
};

export type CreateProductTypeReq = {
	value: string;
};

export type CreateProductTypeResp = {
	productType: ProductType;
};

export type DeleteProductTypeReq = {
	id: number;
};

export type DeleteProductTypeResp = {
	id: number;
};

export type UpdateProductTypeReq = CreateProductTypeReq;

export type UpdateProductTypeResp = {
	product_type: ProductType;
};

class ProductTypeModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.ProductTypes;

	async fetchMany(): Promise<ProductTypesResp> {
		return await this.call<ProductTypesResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async fetchSingle(id: number) {
		return await this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(id)}`,
		});
	}

	async create(product: CreateProductTypeReq): Promise<CreateProductTypeResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: product,
		});
	}

	async update(id: number, product: UpdateProductTypeReq): Promise<UpdateProductTypeResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(id)}`,
			body: product,
		});
	}

	async delete(id: number): Promise<DeleteProductTypeResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(id)}`,
		});
	}
}

export default ProductTypeModule;
