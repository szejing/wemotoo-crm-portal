import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateTaxGroupReq } from './models/request/create-tax-group.req';
import type { TaxGroupReq } from './models/request/tax-group.req';
import type { UpdateTaxGroupReq } from './models/request/update-tax-group.req';
import type { TaxGroupResp } from './models/response/tax-group.resp';
import type { TaxGroupsResp } from './models/response/tax-groups.resp';

class TaxGroupModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.TaxGroups;

	async fetchMany(): Promise<TaxGroupsResp> {
		return await this.call<TaxGroupsResp>({
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

	async create(tag: CreateTaxGroupReq): Promise<TaxGroupResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: tag,
		});
	}

	async update(code: string, tag: UpdateTaxGroupReq): Promise<TaxGroupResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: tag,
		});
	}

	async delete(tag: TaxGroupReq): Promise<TaxGroupResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(tag.code)}`,
		});
	}

	async restore(tag: TaxGroupReq): Promise<TaxGroupResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(tag.code)}`,
		});
	}
}

export default TaxGroupModule;
