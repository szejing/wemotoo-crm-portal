import { options_page_size } from '~/utils/options';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { TaxGroup } from '~/utils/types/tax-group';
import type { TaxGroupCreate } from '~/utils/types/form/tax/tax-group-creation';

const initialEmptyTaxGroup: TaxGroupCreate = {
	code: undefined,
	description: undefined,
	taxes: [],
};

export const useTaxGroupStore = defineStore('taxGroupStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		tax_groups: [] as TaxGroup[],
		newTaxGroup: structuredClone(initialEmptyTaxGroup),
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewTaxGroup() {
			this.newTaxGroup = structuredClone(initialEmptyTaxGroup);
		},

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

		async createTaxGroup() {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.taxGroup.create(this.newTaxGroup);

				if (data.tax_group) {
					successNotification(`${this.newTaxGroup.code} - Tax Group Created !`);
					this.getTaxGroups();
				}
				this.resetNewTaxGroup();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateTaxGroup(code: string, taxGroup: TaxGroup) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.taxGroup.update(code, {
					description: taxGroup.description,
					taxes: taxGroup.taxes.map((t) => ({ code: t.code })),
				});

				if (data.tax_group) {
					successNotification(`Tax Group Updated !`);
					this.getTaxGroups();
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},

		async deleteTaxGroup(code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.taxGroup.delete({ code });

				if (data.tax_group && data.tax_group.code == null) {
					successNotification(`Tax Group Deleted !`);
					this.tax_groups = this.tax_groups.filter((t) => t.code !== code);
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
