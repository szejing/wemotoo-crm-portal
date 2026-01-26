import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateOutletReq } from './models/request/create-outlet.req';
import type { OutletReq } from './models/request/outlet.req';
import type { UpdateOutletReq } from './models/request/update-outlet.req';
import type { OutletResp } from './models/response/outlet.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Outlet } from '~/utils/types/outlet';

class OutletModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Outlets;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<Outlet>> {
		return await this.call<BaseODataResp<Outlet>>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	async getSingle(code: string) {
		return await this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(code)}`,
		});
	}

	async create(outlet: CreateOutletReq): Promise<OutletResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: outlet,
		});
	}

	async update(code: string, outlet: UpdateOutletReq): Promise<OutletResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: outlet,
		});
	}

	async delete(outlet: OutletReq): Promise<OutletResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(outlet.code)}`,
		});
	}

	async restore(outlet: OutletReq): Promise<OutletResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(outlet.code)}`,
		});
	}
}

export default OutletModule;
