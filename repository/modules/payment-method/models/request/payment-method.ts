export type GetPaymentMethodsReq = {
	q?: string;
};

export type UpdatePaymentMethodReq = {
	code: string;
	is_active: boolean;
};
