import type { Customer } from '~/utils/types/customer';

export type CustomersResp = {
	count: number;
	customers: Customer[];
};
