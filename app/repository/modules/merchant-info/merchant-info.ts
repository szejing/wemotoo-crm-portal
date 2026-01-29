import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { UpdateMerchantInfoReq } from './request/update-info.req';
import type { MerchantInfo } from '~/utils/types/merchant-info';

class MerchantInfoModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.MerchantInfo;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<MerchantInfo>> {
		return await this.call<BaseODataResp<MerchantInfo>>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	async saveMany(merchantInfos: UpdateMerchantInfoReq): Promise<BaseODataResp<MerchantInfo>> {
		return await this.call<BaseODataResp<MerchantInfo>>({
			method: 'POST',
			url: `${this.RESOURCE.SaveMany()}`,
			body: merchantInfos,
		});
	}
}

export default MerchantInfoModule;
