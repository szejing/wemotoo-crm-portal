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

	async create(tax: CreateTaxReq): Promise<TaxResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: tax,
		});
	}

	async update(code: string, tax: UpdateTaxReq): Promise<TaxResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: tax,
		});
	}

	async delete(tax: TaxReq): Promise<TaxResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(tax.code)}`,
		});
	}

	async restore(tax: TaxReq): Promise<TaxResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(tax.code)}`,
		});
	}
}

export default TaxModule;
