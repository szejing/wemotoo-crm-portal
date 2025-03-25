import type { ProductOptionValue } from '~/utils/types/product-option-value';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';
import type { ProductOption } from '~/utils/types/product-option';

type BaseProductOptionReq = {
	id: number;
};

type ProductOptionResp = {
	productOption: ProductOption;
};

type ProductOptionsResp = {
	count: number;
	productOptions: ProductOption[];
};

type CreateProductOptionReq = {
	name: string;
	values: ProductOptionValue[];
};

type UpdateProductOptionReq = {
	name: string;
	values: ProductOptionValue[];
	metadata?: Record<string, unknown> | undefined;
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

	async create(option: CreateProductOptionReq): Promise<ProductOptionResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: option,
		});
	}

	async update(id: number, option: UpdateProductOptionReq): Promise<ProductOptionResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(id)}`,
			body: removeNullValues(option),
		});
	}

	async delete(option: BaseProductOptionReq): Promise<ProductOptionResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(option.id)}`,
		});
	}

	async restore(option: BaseProductOptionReq): Promise<ProductOptionResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(option.id)}`,
		});
	}
}

export default ProductOptionModule;
