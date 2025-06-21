import { options_page_size } from '~/utils/options';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { TaxRule } from '~/utils/types/tax-rule';

export const useTaxRuleStore = defineStore('taxRuleStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		tax_rules: [] as TaxRule[],
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

		async getTaxRules() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.taxRule.fetchMany();

				if (data.tax_rules) {
					this.tax_rules = data.tax_rules;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async getTaxRuleByCode(code: string) {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.taxRule.fetchSingle(code);

				return data.tax_rule;
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

		async deleteTaxRule(code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.taxRule.delete({ code });

				if (data.tax_rule.code) {
					successNotification(`Tax Rule #${data.tax_rule.code} Deleted !`);

					const index = this.tax_rules.findIndex((t) => t.code === data.tax_rule.code);
					this.tax_rules.splice(index, 1);
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
