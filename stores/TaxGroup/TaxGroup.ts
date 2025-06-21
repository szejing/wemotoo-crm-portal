import { options_page_size } from '~/utils/options';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { Tax } from '~/utils/types/tax';
import type { TaxGroup } from '~/utils/types/tax-group';

export const useTaxGroupStore = defineStore('taxGroupStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		tax_groups: [] as TaxGroup[],
		// newOutlet: structuredClone(initialEmptyOutlet),
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		updatePageSize(size: number) {
			this.pageSize = size;
		},

		async getTaxGroups() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.taxGroup.fetchMany();

				if (data.tax_groups) {
					this.tax_groups = data.tax_groups;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async getTaxGroupByCode(code: string) {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.taxGroup.fetchSingle(code);

				return data.tax_group;
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

		async deleteTaxGroup(code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.taxGroup.delete({ code });

				if (data.tax_group.code) {
					successNotification(`Tax Group #${data.tax_group.code} Deleted !`);

					const index = this.tax_groups.findIndex((t) => t.code === data.tax_group.code);
					this.tax_groups.splice(index, 1);
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
