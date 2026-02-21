export type PatchAffiliateTierReq = {
	name?: string;
	min_referrals?: number;
	default_commission_percentage?: number;
	merchant_id?: string;
	user?: { id: string };
};
