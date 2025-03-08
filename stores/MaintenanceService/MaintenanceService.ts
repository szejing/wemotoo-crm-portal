import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { MaintenanceService } from '~/utils/types/maintenance-service';

// const initialEmptyMaintenance: MaintenanceService = {};

export const useMaintenanceServiceStore = defineStore({
	id: 'maintenanceServiceStore',
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		// newMaintenance: structuredClone(initialEmptyMaintenance),
		maintenanceServices: [] as MaintenanceService[],
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewMaintenance() {
			// this.newMaintenance = structuredClone(initialEmptyMaintenance);
		},
	},
});
