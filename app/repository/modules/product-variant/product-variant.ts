import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { GetProductVariantByCodeResponse } from './models/response/get-product-variant.resp';

class ProductVariantModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.ProdVariants;

	async getVariantsByProdCode(code: string): Promise<GetProductVariantByCodeResponse> {
		return await this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.SingleByProdCode(code)}`,
		});
	}
}

export default ProductVariantModule;
