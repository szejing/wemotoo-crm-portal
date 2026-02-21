export type CreateAffiliateReq = {
	user_id: string;
	tier_id?: number;
	slug?: string;
	merchant_id?: string;
	user?: { id: string };
};
