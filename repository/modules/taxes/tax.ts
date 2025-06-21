import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateTaxReq } from './models/request/create-tax.req';
import type { TaxReq } from './models/request/tax.req';
import type { UpdateTaxReq } from './models/request/update-tax.req';
import type { TaxResp } from './models/response/tax.resp';
import type { TaxesResp } from './models/response/taxes.resp';

class TaxModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Taxes;

	async fetchMany(): Promise<TaxesResp> {
		return await this.call<TaxesResp>({
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

	async create(tag: CreateTaxReq): Promise<TaxResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: tag,
		});
	}

	async update(code: string, tag: UpdateTaxReq): Promise<TaxResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: tag,
		});
	}

	async delete(tag: TaxReq): Promise<TaxResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(tag.code)}`,
		});
	}

	async restore(tag: TaxReq): Promise<TaxResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(tag.code)}`,
		});
	}
}

export default TaxModule;
