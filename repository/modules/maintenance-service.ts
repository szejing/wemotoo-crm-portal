import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';
import type { CategoryInput } from '~/utils/types/category';
import type { TagInput } from '~/utils/types/tag';
import type { PriceInput } from '~/utils/types/price';
import type { MaintenanceStatus } from 'wemotoo-common';
import type { MaintenanceService } from '~/utils/types/maintenance-service';

export type MaintenanceServicesResp = {
	count: number;
	maintenances: MaintenanceService[];
};

export type CreateMaintenanceServiceReq = {
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

export type CreateMaintenanceServiceResp = {
	count: number;
	maintenances: MaintenanceService[];
	maintenance: MaintenanceService;
};

export type DeleteMaintenanceServiceReq = {
	code: string;
};

export type DeleteMaintenanceServiceResp = {
	code: string;
};

export type UpdateMaintenanceServiceReq = CreateMaintenanceServiceReq;

export type UpdateMaintenanceServiceResp = {
	maintenance: MaintenanceService;
};

class MaintenanceServiceModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Maintenance;

	async fetchMany(): Promise<MaintenanceServicesResp> {
		return await this.call<MaintenanceServicesResp>({
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

	async create(maintenanceService: CreateMaintenanceServiceReq): Promise<CreateMaintenanceServiceResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: maintenanceService,
		});
	}

	async update(code: string, maintenanceService: UpdateMaintenanceServiceReq): Promise<UpdateMaintenanceServiceResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update()}`,
			query: { code },
			body: maintenanceService,
		});
	}

	async delete(maintenanceService: DeleteMaintenanceServiceReq): Promise<DeleteMaintenanceServiceResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete()}`,
			query: maintenanceService,
		});
	}
}

export default MaintenanceServiceModule;
