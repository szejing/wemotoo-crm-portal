import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type {
	CreateDiscountRequest,
	UpdateDiscountRequest,
	DiscountResponse,
	PaginatedDiscountResponse,
} from './discount.type';

function unwrapDiscountPayload(raw: unknown): DiscountResponse {
	if (raw === null || typeof raw !== 'object') {
		return raw as DiscountResponse;
	}
	const obj = raw as Record<string, unknown>;
	if (
		'data' in obj &&
		obj.data !== null &&
		typeof obj.data === 'object' &&
		'code' in (obj.data as object)
	) {
		return obj.data as DiscountResponse;
	}
	return raw as DiscountResponse;
}

class DiscountModule extends HttpFactory {
	async create(body: CreateDiscountRequest) {
		const raw = await this.call<unknown>({
			method: 'POST',
			url: MerchantRoutes.Discounts.Create(),
			body,
		});
		return unwrapDiscountPayload(raw);
	}

	async getMany(query?: BaseODataReq) {
		return await this.call<PaginatedDiscountResponse>({
			method: 'GET',
			url: MerchantRoutes.Discounts.Many(),
			query,
		});
	}

	async getSingle(code: string) {
		const raw = await this.call<unknown>({
			method: 'GET',
			url: MerchantRoutes.Discounts.Single(code),
		});
		return unwrapDiscountPayload(raw);
	}

	async update(code: string, body: UpdateDiscountRequest) {
		const raw = await this.call<unknown>({
			method: 'PATCH',
			url: MerchantRoutes.Discounts.Update(code),
			body,
		});
		return unwrapDiscountPayload(raw);
	}

	async remove(code: string) {
		const raw = await this.call<unknown>({
			method: 'DELETE',
			url: MerchantRoutes.Discounts.Delete(code),
		});
		return unwrapDiscountPayload(raw);
	}
}

export default DiscountModule;
