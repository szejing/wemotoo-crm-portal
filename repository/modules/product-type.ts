import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';
import type { ProductType } from '~/utils/types/product-type';

type BaseProductTypeReq = {
	id: number;
};

type ProductTypeResp = {
	productType: ProductType;
};

type ProductTypesResp = {
	count: number;
	productTypes: ProductType[];
};

type CreateProductTypeReq = {
	value: string;
};

type UpdateProductTypeReq = CreateProductTypeReq;

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

	async create(product: CreateProductTypeReq): Promise<ProductTypeResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: product,
		});
	}

	async update(id: number, product: UpdateProductTypeReq): Promise<ProductTypeResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(id)}`,
			body: product,
		});
	}

	async delete(type: BaseProductTypeReq): Promise<ProductTypeResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(type.id)}`,
		});
	}

	async restore(type: BaseProductTypeReq): Promise<ProductTypeResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(type.id)}`,
		});
	}
}

export default ProductTypeModule;
