import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { CreateDiscountReq } from './models/request/create-discount.req';
import type { DiscountReq } from './models/request/discount.req';
import type { UpdateDiscountReq } from './models/request/update-discount.req';
import type { CreateDiscountResp } from './models/response/create-discount.resp';
import type { DiscountResp } from './models/response/discount.resp';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Discount } from '~/utils/types/discount';

class DiscountModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Discounts;

	async create(body: CreateDiscountReq): Promise<CreateDiscountResp> {
		return await this.call<CreateDiscountResp>({
			method: 'POST',
			url: this.RESOURCE.Create(),
			body,
		});
	}

	async getMany(query?: BaseODataReq): Promise<BaseODataResp<Discount>> {
		return await this.call<BaseODataResp<Discount>>({
			method: 'GET',
			url: this.RESOURCE.Many(),
			query,
		});
	}

	async getSingle(code: string): Promise<DiscountResp> {
		return await this.call<DiscountResp>({
			method: 'GET',
			url: this.RESOURCE.Single(code),
		});
	}

	async update(code: string, body: UpdateDiscountReq): Promise<DiscountResp> {
		return await this.call<DiscountResp>({
			method: 'PATCH',
			url: this.RESOURCE.Update(code),
			body,
		});
	}

	async remove(discount: DiscountReq): Promise<DiscountResp> {
		return await this.call<DiscountResp>({
			method: 'DELETE',
			url: this.RESOURCE.Delete(discount.code),
		});
	}
}

export default DiscountModule;
