import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateTaxGroupReq } from './models/request/create-tax-group.req';
import type { TaxGroupReq } from './models/request/tax-group.req';
import type { UpdateTaxGroupReq } from './models/request/update-tax-group.req';
import type { TaxGroupResp } from './models/response/tax-group.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { TaxGroup } from '~/utils/types/tax-group';

class TaxGroupModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.TaxGroups;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<TaxGroup>> {
		return await this.call<BaseODataResp<TaxGroup>>({
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

	async create(taxGroup: CreateTaxGroupReq): Promise<TaxGroupResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: taxGroup,
		});
	}

	async update(code: string, taxGroup: UpdateTaxGroupReq): Promise<TaxGroupResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: taxGroup,
		});
	}

	async delete(taxGroup: TaxGroupReq): Promise<TaxGroupResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(taxGroup.code)}`,
		});
	}

	async restore(taxGroup: TaxGroupReq): Promise<TaxGroupResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(taxGroup.code)}`,
		});
	}
}

export default TaxGroupModule;
