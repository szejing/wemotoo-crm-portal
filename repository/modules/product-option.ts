import type { ProductOptionValue } from '~/utils/types/product-option-value';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';
import type { ProductOption } from '~/utils/types/product-option';

export type ProductOptionsResp = {
	count: number;
	productOptions: ProductOption[];
};

export type CreateProductOptionReq = {
	name: string;
	values: ProductOptionValue[];
};

export type CreateProductOptionResp = {
	productOption: ProductOption;
};

export type DeleteProductOptionReq = {
	id: number;
};

export type DeleteProductOptionResp = {
	option_id: number;
};

export type UpdateProductOptionReq = {
	name: string;
	values: ProductOptionValue[];
	metadata?: Record<string, any> | undefined;
};

export type UpdateProductOptionResp = {
	productOption: ProductOption;
};

class ProductOptionModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.ProdOptions;

	async fetchMany(): Promise<ProductOptionsResp> {
		return await this.call<ProductOptionsResp>({
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

	async create(option: CreateProductOptionReq): Promise<CreateProductOptionResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: option,
		});
	}

	async update(id: number, option: UpdateProductOptionReq): Promise<UpdateProductOptionResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(id)}`,
			body: removeNullValues(option),
		});
	}

	async delete(option: DeleteProductOptionReq): Promise<DeleteProductOptionResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(option.id)}`,
			query: option,
		});
	}
}

export default ProductOptionModule;
