import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateOutletReq } from './models/request/create-outlet.req';
import type { OutletReq } from './models/request/outlet.req';
import type { UpdateOutletReq } from './models/request/update-outlet.req';
import type { OutletResp } from './models/response/outlet.resp';
import type { OutletsResp } from './models/response/outlets.resp';

class OutletModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Outlets;

	async fetchMany(): Promise<OutletsResp> {
		return await this.call<OutletsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async fetchSingle(code: string) {
		return await this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(code)}`,
		});
	}

	async create(tag: CreateOutletReq): Promise<OutletResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: tag,
		});
	}

	async update(code: string, tag: UpdateOutletReq): Promise<OutletResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: tag,
		});
	}

	async delete(tag: OutletReq): Promise<OutletResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(tag.code)}`,
		});
	}

	async restore(tag: OutletReq): Promise<OutletResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(tag.code)}`,
		});
	}
}

export default OutletModule;
