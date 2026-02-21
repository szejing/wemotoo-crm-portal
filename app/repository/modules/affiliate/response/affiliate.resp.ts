export type AffiliateTier = {
	id: number;
	name: string;
	min_referrals: number;
	default_commission_percentage: number;
};

export type Affiliate = {
	id: string;
	user_id: string;
	slug: string;
	tier_id: number | null;
	total_referrals_count: number;
	current_balance: number;
	created_at: string;
	tier?: AffiliateTier;
};

export type AffiliateReport = {
	total_referrals_count: number;
	pending_commission_total: number;
	available_balance: number;
};

export type GetAffiliateResponse = {
	affiliate: Affiliate;
};

export type GetAffiliatesResponse = {
	data: Affiliate[];
	'@odata.context'?: string;
	'@odata.count'?: number;
};

export type GetAffiliateTierResponse = {
	tier: AffiliateTier;
};

export type GetAffiliateTiersResponse = {
	tiers: AffiliateTier[];
};

export type GetAffiliateReportResponse = {
	report: AffiliateReport;
};

export type DeleteTierResponse = {
	success: boolean;
};
