import type { MaintenanceStatus } from '../enum/maintenance-status';
import type { CategoryInput } from './category';
import type { PriceInput } from './price';
import type { TagInput } from './tag';

export type MaintenanceService = {
	code: string | undefined;
	name: string | undefined;
	short_desc: string | undefined;
	long_desc: string | undefined;
	is_discountable: boolean;
	is_active: boolean;

	status: MaintenanceStatus;

	// categories
	categories: CategoryInput[] | undefined;

	// tags
	tags: TagInput[] | undefined;

	// thumbnail
	thumbnail: string | undefined;

	// galleries
	galleries: string[] | undefined;

	// price
	price_types: PriceInput[] | undefined;
};
