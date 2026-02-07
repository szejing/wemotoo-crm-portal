import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { CRMUser } from '~/utils/types/crm-user';
import type { CreateCrmUserReq } from './request/create-crm-user.req';
import type { UpdateCrmUserReq } from './request/update-crm-user.req';
import type { CrmUserResp } from './response/crm-user.resp';
import type { CreateCrmUserResp } from './response/create-crm-user.resp';
import type { CrmUserReq } from './request/crm-user.req';
import type { ChangePasswordReq } from './request/change-password.req';

class CrmUserModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.CrmUsers;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<CRMUser>> {
		return await this.call<BaseODataResp<CRMUser>>({
			method: 'GET',
			url: this.RESOURCE.Many(),
			query,
		});
	}

	async getSingle(id: string): Promise<CrmUserResp> {
		return await this.call<CrmUserResp>({
			method: 'GET',
			url: this.RESOURCE.Single(id),
		});
	}

	async create(body: CreateCrmUserReq): Promise<CreateCrmUserResp> {
		return await this.call<CreateCrmUserResp>({
			method: 'POST',
			url: this.RESOURCE.Create(),
			body,
		});
	}

	async update(id: string, body: UpdateCrmUserReq): Promise<CrmUserResp> {
		return await this.call<CrmUserResp>({
			method: 'PATCH',
			url: this.RESOURCE.Update(id),
			body,
		});
	}

	async updatePassword(id: string, body: ChangePasswordReq): Promise<CrmUserResp> {
		return await this.call<CrmUserResp>({
			method: 'PATCH',
			url: this.RESOURCE.UpdatePassword(id),
			body,
		});
	}

	async delete(crmUser: CrmUserReq): Promise<CrmUserResp> {
		return await this.call<CrmUserResp>({
			method: 'DELETE',
			url: this.RESOURCE.Delete(crmUser.id),
		});
	}
}

export default CrmUserModule;
