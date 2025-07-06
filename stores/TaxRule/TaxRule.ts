import { options_page_size } from '~/utils/options';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { TaxRule } from '~/utils/types/tax-rule';
import type { TaxDetailCreate, TaxRuleCreate } from '~/utils/types/form/tax/tax-rule-creation';
import { defaultTaxRulesRelations } from 'wemotoo-common';
import type { AmountType } from 'wemotoo-common';
import { filterRelations } from '~/utils/filter-relations';

const initialEmptyTaxRule: TaxRuleCreate = {
	code: undefined,
	description: undefined,
	details: [] as TaxDetailCreate[],
};

export const useTaxRuleStore = defineStore('taxRuleStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		tax_rules: [] as TaxRule[],
		total_tax_rules: 0 as number,
		new_tax_rule: structuredClone(initialEmptyTaxRule),
		page_size: options_page_size[0],
		current_page: 1,
		errors: [] as string[],
	}),
	actions: {
		resetNewTaxRule() {
			this.new_tax_rule = structuredClone(initialEmptyTaxRule);
		},

		async updatePageSize(size: number) {
			this.page_size = size;

			if (this.page_size > this.tax_rules.length) {
				this.current_page = 1;
				return;
			}

			this.getTaxRules();
		},

		async updatePage(page: number) {
			this.current_page = page;

			if (this.current_page < 0 || this.tax_rules.length === this.total_tax_rules) {
				return;
			}

			this.getTaxRules();
		},

		async getTaxRules() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data, '@odata.count': total } = await $api.taxRule.getMany({
					$top: this.page_size,
					$count: true,
					$skip: (this.current_page - 1) * this.page_size,
					$expand: filterRelations(defaultTaxRulesRelations).join(','),
				});

				if (data) {
					if (this.current_page > 1 && this.total_tax_rules > this.tax_rules.length) {
						this.tax_rules = [...this.tax_rules, ...data];
					} else {
						this.tax_rules = data;
					}

					this.total_tax_rules = total ?? 0;
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
				const data = await $api.taxRule.getSingle(code);

				return data.tax_rule;
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async createTaxRule() {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.taxRule.create(this.new_tax_rule);

				if (data.tax_rule) {
					successNotification(`${this.new_tax_rule.code} - Tax Rule Created !`);
					this.tax_rules.push(data.tax_rule);
				}
				this.resetNewTaxRule();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateTaxRule(code: string, taxRule: TaxRule) {
			this.updating = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.taxRule.update(code, {
					code: taxRule.code,
					description: taxRule.description,
					details: taxRule.details.map((detail) => ({
						id: detail.id,
						description: detail.description,
						tax_code: detail.tax_code ?? '',
						tax_condition: {
							id: detail.tax_condition?.id ?? 0,
							tax_code: detail.tax_condition?.tax_code ?? detail.tax_code ?? '',
							starts_at: detail.tax_condition?.starts_at ? new Date(detail.tax_condition.starts_at) : undefined,
							ends_at: detail.tax_condition?.ends_at ? new Date(detail.tax_condition.ends_at) : undefined,
							amount_type: detail.tax_condition?.amount_type as AmountType,
							rate: detail.tax_condition?.rate ?? 0,
							min_amount: detail.tax_condition?.min_amount ?? 0,
							max_amount: detail.tax_condition?.max_amount ?? 0,
							filters: [],
						},
					})),
				});

				if (data.tax_rule) {
					successNotification(`${this.new_tax_rule.code} - Tax Rule Created !`);
					this.tax_rules.push(data.tax_rule);
				}
				this.resetNewTaxRule();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

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

		// async deleteTaxRuleDetail(code: string) {
		// 	this.loading = true;

		// 	const { $api } = useNuxtApp();

		// 	try {
		// 		const data = await $api.taxRule.delete({ code });
		// 		if (data.tax_rule.code) {
		// 			successNotification(`Tax Rule #${data.tax_rule.code} Deleted !`);
		// 			const index = this.tax_rules.findIndex((t) => t.code === data.tax_rule.code);
		// 			this.tax_rules.splice(index, 1);
		// 		}
		// 	} catch (err: any) {
		// 		console.error(err);
		// 		failedNotification(err.message);
		// 	} finally {
		// 		this.loading = false;
		// 	}
		// },
	},
});
