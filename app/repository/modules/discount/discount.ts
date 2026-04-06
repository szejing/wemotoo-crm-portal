import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type {
	CreateDiscountRequest,
	UpdateDiscountRequest,
	BaseDiscountResponse,
	PaginatedDiscountResponse,
} from './discount.type';

class DiscountModule extends HttpFactory {
	async create(body: CreateDiscountRequest) {
		return await this.call<BaseDiscountResponse>({
			method: 'POST',
			url: MerchantRoutes.Discounts.Create(),
			body,
		});
	}

	async getMany(query?: BaseODataReq) {
		return await this.call<PaginatedDiscountResponse>({
			method: 'GET',
			url: MerchantRoutes.Discounts.Many(),
			query,
		});
	}

	async getSingle(code: string) {
		return await this.call<BaseDiscountResponse>({
			method: 'GET',
			url: MerchantRoutes.Discounts.Single(code),
		});
	}

	async update(code: string, body: UpdateDiscountRequest) {
		return await this.call<BaseDiscountResponse>({
			method: 'PATCH',
			url: MerchantRoutes.Discounts.Update(code),
			body,
		});
	}

	async remove(code: string) {
		return await this.call<BaseDiscountResponse>({
			method: 'DELETE',
			url: MerchantRoutes.Discounts.Delete(code),
		});
	}
}

export default DiscountModule;
