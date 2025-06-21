import { options_page_size } from '~/utils/options';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { Tax } from '~/utils/types/tax';

export const useTaxStore = defineStore('taxStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		taxes: [] as Tax[],
		// newOutlet: structuredClone(initialEmptyOutlet),
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewOutlet() {
			// this.newOutlet = structuredClone(initialEmptyOutlet);
		},

		updatePageSize(size: number) {
			this.pageSize = size;
		},

		async getTaxes() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.tax.fetchMany();

				if (data.taxes) {
					this.taxes = data.taxes;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async getTaxByCode(code: string) {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.tax.fetchSingle(code);

				return data.tax;
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		// async addOutlet(outlet: Outlet) {
		// 	this.adding = true;
		// 	this.loading = true;

		// 	const { $api } = useNuxtApp();

		// 	try {
		// 		const data = await $api.outlet.create(outlet);

		// 		if (data.outlet) {
		// 			successNotification(`${outlet.code} - Outlet Created !`);
		// 			this.outlets.push(data.outlet);
		// 		}
		// 		this.resetNewOutlet();
		// 	} catch (err: any) {
		// 		console.error(err);
		// 		failedNotification(err.message);
		// 	} finally {
		// 		this.adding = false;
		// 		this.loading = false;
		// 	}
		// },

		// async updateOutlet(code: string, outlet: Outlet) {
		// 	this.updating = true;

		// 	const { $api } = useNuxtApp();

		// 	try {
		// 		const data = await $api.outlet.update(code, {
		// 			description: outlet.description,
		// 			address1: outlet.address1,
		// 			address2: outlet.address2,
		// 			address3: outlet.address3,
		// 			city: outlet.city,
		// 			country_code: outlet.country_code,
		// 			state: outlet.state,
		// 			postal_code: outlet.postal_code,
		// 		});

		// 		if (data.outlet) {
		// 			successNotification(`Outlet Updated !`);
		// 			this.getOutlets();
		// 		}
		// 	} catch (err: any) {
		// 		console.error(err);
		// 		failedNotification(err.message);
		// 	} finally {
		// 		this.updating = false;
		// 	}
		// },

		async deleteTax(code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.tax.delete({ code });

				if (data.tax.code) {
					successNotification(`Tax #${data.tax.code} Deleted !`);

					const index = this.taxes.findIndex((t) => t.code === data.tax.code);
					this.taxes.splice(index, 1);
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
