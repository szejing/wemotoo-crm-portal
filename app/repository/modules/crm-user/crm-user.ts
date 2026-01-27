import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { CRMUser } from '~/utils/types/crm-user';

class CrmUserModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.CrmUsers;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<CRMUser>> {
		return await this.call<BaseODataResp<CRMUser>>({
			method: 'GET',
			url: this.RESOURCE.Many(),
			query,
		});
	}

	async getSingle(id: string): Promise<{ user: CRMUser }> {
		return await this.call<{ user: CRMUser }>({
			method: 'GET',
			url: this.RESOURCE.Single(id),
		});
	}

	async update(id: string, body: Record<string, unknown>): Promise<{ user: CRMUser }> {
		return await this.call<{ user: CRMUser }>({
			method: 'PATCH',
			url: this.RESOURCE.Update(id),
			body,
		});
	}

	async updatePassword(id: string, body: Record<string, unknown>): Promise<{ user: CRMUser }> {
		return await this.call<{ user: CRMUser }>({
			method: 'PATCH',
			url: this.RESOURCE.UpdatePassword(id),
			body,
		});
	}
}

export default CrmUserModule;
