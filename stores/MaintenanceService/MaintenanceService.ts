import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { MaintenanceService } from '~/utils/types/maintenance-service';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import { MaintenanceStatus } from 'wemotoo-common';

const initialEmptyMaintenance: MaintenanceService = {
	code: undefined,
	name: undefined,
	short_desc: undefined,
	long_desc: undefined,
	is_active: true,
	is_discountable: true,

	status: MaintenanceStatus.DRAFT,

	// categories
	categories: [],

	// tags
	tags: [],

	// thumbnail
	thumbnail: undefined,

	// galleries
	galleries: undefined,

	// price
	price_types: [
		{
			id: undefined,
			currency_code: 'MYR',
			orig_sell_price: undefined,
			cost_price: undefined,
			sale_price: undefined,
		},
	],
};

export const useMaintenanceServiceStore = defineStore('maintenanceServiceStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		newMaintenance: structuredClone(initialEmptyMaintenance),
		maintenanceServices: [] as MaintenanceService[],
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewMaintenance() {
			this.newMaintenance = structuredClone(initialEmptyMaintenance);
		},

		updatePageSize(size: number) {
			this.pageSize = size;
		},

		async getMaintenanceServices() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.maintenanceService.fetchMany();

				if (data.maintenances) {
					this.maintenanceServices = data.maintenances;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async addMaintenanceService(input: MaintenanceService): Promise<boolean> {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.maintenanceService.create(input);

				if (data.maintenances) {
					successNotification(`${data.maintenance.code} - Maintenance Service Created !`);
				}

				if (data.maintenances) {
					this.maintenanceServices = data.maintenances;
				}

				this.resetNewMaintenance();
				return true;
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				return false;
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateMaintenanceService(code: string, input: MaintenanceService) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.maintenanceService.update(code, {
					name: input.name,
					short_desc: input.short_desc,
					long_desc: input.long_desc,
					is_discountable: input.is_discountable,
					is_active: input.is_active,
					status: input.status,
					categories: input.categories,
					tags: input.tags,
					thumbnail: input.thumbnail,
					galleries: input.galleries,
					price_types: input.price_types,
				});

				if (data.maintenance) {
					successNotification(`Maintenance Service Updated !`);
					this.getMaintenanceServices();
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},

		async deleteMaintenanceService(code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.maintenanceService.delete({ code });

				if (data.code) {
					successNotification(`Maintenance Service Code #${data.code} Deleted !`);

					const index = this.maintenanceServices.findIndex((t) => t.code === data.code);
					this.maintenanceServices.splice(index, 1);
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},
	},
});
