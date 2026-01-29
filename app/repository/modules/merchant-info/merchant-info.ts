import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { UpdateMerchantInfoReq } from './request/update-info.req';
import type { MerchantInfo } from '~/utils/types/merchant-info';
import type { MerchantInfoResp } from './response/merchant-info.resp';

class MerchantInfoModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.MerchantInfo;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<MerchantInfo>> {
		return await this.call<BaseODataResp<MerchantInfo>>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	async saveMany(MerchantInfos: UpdateMerchantInfoReq): Promise<MerchantInfoResp[]> {
		return await this.call<MerchantInfoResp[]>({
			method: 'POST',
			url: `${this.RESOURCE.SaveMany()}`,
			body: MerchantInfos,
		});
	}
}

export default MerchantInfoModule;
