import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { CreateAffiliateReq } from './request/create-affiliate.req';
import type { CreateAffiliateTierReq } from './request/create-tier.req';
import type { PatchAffiliateTierReq } from './request/patch-tier.req';
import type { DeleteAffiliateTierReq } from './request/delete-tier.req';
import type {
	GetAffiliateResponse,
	GetAffiliatesResponse,
	GetAffiliateTierResponse,
	GetAffiliateTiersResponse,
	GetAffiliateReportResponse,
	DeleteTierResponse,
} from './response/affiliate.resp';

class AffiliateModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Affiliates;

	async getMany(query: BaseODataReq): Promise<GetAffiliatesResponse> {
		return await this.call<GetAffiliatesResponse>({
			method: 'GET',
			url: this.RESOURCE.Many(),
			query,
		});
	}

	async getBySlug(slug: string): Promise<GetAffiliateResponse> {
		return await this.call<GetAffiliateResponse>({
			method: 'GET',
			url: this.RESOURCE.BySlug(slug),
		});
	}

	async getById(id: string): Promise<GetAffiliateResponse> {
		return await this.call<GetAffiliateResponse>({
			method: 'GET',
			url: this.RESOURCE.Single(id),
		});
	}

	async create(body: CreateAffiliateReq): Promise<GetAffiliateResponse> {
		return await this.call<GetAffiliateResponse>({
			method: 'POST',
			url: this.RESOURCE.Create(),
			body,
		});
	}

	async getTiers(): Promise<GetAffiliateTiersResponse> {
		return await this.call<GetAffiliateTiersResponse>({
			method: 'GET',
			url: this.RESOURCE.Tiers(),
		});
	}

	async createTier(body: CreateAffiliateTierReq): Promise<GetAffiliateTierResponse> {
		return await this.call<GetAffiliateTierResponse>({
			method: 'POST',
			url: this.RESOURCE.TierCreate(),
			body,
		});
	}

	async updateTier(id: number, body: PatchAffiliateTierReq): Promise<GetAffiliateTierResponse> {
		return await this.call<GetAffiliateTierResponse>({
			method: 'PATCH',
			url: this.RESOURCE.TierUpdate(id),
			body,
		});
	}

	async deleteTier(id: number, body?: DeleteAffiliateTierReq): Promise<DeleteTierResponse> {
		return await this.call<DeleteTierResponse>({
			method: 'DELETE',
			url: this.RESOURCE.TierDelete(id),
			body: body ?? {},
		});
	}

	async getMyReport(query?: { user?: { id: string } }): Promise<GetAffiliateReportResponse> {
		return await this.call<GetAffiliateReportResponse>({
			method: 'GET',
			url: this.RESOURCE.MyReport(),
			query,
		});
	}
}

export default AffiliateModule;
