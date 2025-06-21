import type { TaxGroup } from '~/utils/types/tax-group';

export type TaxGroupsResp = {
	count: number;
	tax_groups: TaxGroup[];
};
