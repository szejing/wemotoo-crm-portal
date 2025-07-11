import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateTaxRuleReq } from './models/request/create-tax-rule.req';
import type { TaxRuleReq } from './models/request/tax-rule.req';
import type { UpdateTaxRuleReq } from './models/request/update-tax-rule.req';
import type { TaxRuleResp } from './models/response/tax-rule.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { TaxRule } from '~/utils/types/tax-rule';

class TaxRuleModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.TaxRules;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<TaxRule>> {
		return await this.call<BaseODataResp<TaxRule>>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	async getSingle(code: string): Promise<TaxRuleResp> {
		return await this.call<TaxRuleResp>({
			method: 'GET',
			url: `${this.RESOURCE.Single(code)}`,
		});
	}

	async create(taxRule: CreateTaxRuleReq): Promise<TaxRuleResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: taxRule,
		});
	}

	async update(code: string, taxRule: UpdateTaxRuleReq): Promise<TaxRuleResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: taxRule,
		});
	}

	async delete(taxRule: TaxRuleReq): Promise<TaxRuleResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(taxRule.code)}`,
		});
	}

	async restore(taxRule: TaxRuleReq): Promise<TaxRuleResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(taxRule.code)}`,
		});
	}
}

export default TaxRuleModule;
