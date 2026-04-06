import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type {
	CreateVoucherRequest,
	UpdateVoucherRequest,
	BaseVoucherResponse,
	PaginatedVoucherResponse,
} from './voucher.type';

class VoucherModule extends HttpFactory {
	async create(body: CreateVoucherRequest) {
		return await this.call<BaseVoucherResponse>({
			method: 'POST',
			url: MerchantRoutes.Vouchers.Create(),
			body,
		});
	}

	async getMany(query?: BaseODataReq) {
		return await this.call<PaginatedVoucherResponse>({
			method: 'GET',
			url: MerchantRoutes.Vouchers.Many(),
			query,
		});
	}

	async getSingle(code: string) {
		return await this.call<BaseVoucherResponse>({
			method: 'GET',
			url: MerchantRoutes.Vouchers.Single(code),
		});
	}

	async update(code: string, body: UpdateVoucherRequest) {
		return await this.call<BaseVoucherResponse>({
			method: 'PATCH',
			url: MerchantRoutes.Vouchers.Update(code),
			body,
		});
	}

	async remove(code: string) {
		return await this.call<BaseVoucherResponse>({
			method: 'DELETE',
			url: MerchantRoutes.Vouchers.Delete(code),
		});
	}
}

export default VoucherModule;
