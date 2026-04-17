import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { CreateVoucherReq } from './models/request/create-voucher.req';
import type { VoucherReq } from './models/request/voucher.req';
import type { UpdateVoucherReq } from './models/request/update-voucher.req';
import type { CreateVoucherResp } from './models/response/create-voucher.resp';
import type { VoucherResp } from './models/response/voucher.resp';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Voucher } from '~/utils/types/voucher';

class VoucherModule extends HttpFactory {
	async create(body: CreateVoucherReq): Promise<CreateVoucherResp> {
		return await this.call<CreateVoucherResp>({
			method: 'POST',
			url: MerchantRoutes.Vouchers.Create(),
			body,
		});
	}

	async getMany(query?: BaseODataReq): Promise<BaseODataResp<Voucher>> {
		return await this.call<BaseODataResp<Voucher>>({
			method: 'GET',
			url: MerchantRoutes.Vouchers.Many(),
			query,
		});
	}

	async getSingle(code: string): Promise<VoucherResp> {
		return await this.call<VoucherResp>({
			method: 'GET',
			url: MerchantRoutes.Vouchers.Single(code),
		});
	}

	async update(code: string, body: UpdateVoucherReq): Promise<VoucherResp> {
		return await this.call<VoucherResp>({
			method: 'PATCH',
			url: MerchantRoutes.Vouchers.Update(code),
			body,
		});
	}

	async remove(voucher: VoucherReq): Promise<VoucherResp> {
		return await this.call<VoucherResp>({
			method: 'DELETE',
			url: MerchantRoutes.Vouchers.Delete(voucher.code),
		});
	}
}

export default VoucherModule;
