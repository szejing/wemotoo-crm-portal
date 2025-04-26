import type { ProductVariant } from '~/utils/types/product-variant';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';

type GetProductVariantByCodeResponse = {
	variants: ProductVariant[];
};

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
