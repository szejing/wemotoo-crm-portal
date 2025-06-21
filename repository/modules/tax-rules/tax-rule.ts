import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { CreateTaxRuleReq } from './models/request/create-tax-rule.req';
import type { TaxRuleReq } from './models/request/tax-rule.req';
import type { UpdateTaxRuleReq } from './models/request/update-tax-rule.req';
import type { TaxRuleResp } from './models/response/tax-rule.resp';
import type { TaxRulesResp } from './models/response/tax-rules.resp';

class TaxRuleModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.TaxRules;

	async fetchMany(): Promise<TaxRulesResp> {
		return await this.call<TaxRulesResp>({
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

	async create(tag: CreateTaxRuleReq): Promise<TaxRuleResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: tag,
		});
	}

	async update(code: string, tag: UpdateTaxRuleReq): Promise<TaxRuleResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: tag,
		});
	}

	async delete(tag: TaxRuleReq): Promise<TaxRuleResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(tag.code)}`,
		});
	}

	async restore(tag: TaxRuleReq): Promise<TaxRuleResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(tag.code)}`,
		});
	}
}

export default TaxRuleModule;
