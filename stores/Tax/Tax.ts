import { options_page_size } from '~/utils/options';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { Tax } from '~/utils/types/tax';
import type { TaxCreate } from '~/utils/types/form/tax/tax-creation';

const initialEmptyTax: TaxCreate = {
	code: undefined,
	description: undefined,
	is_inclusive: false,
	is_active: true,
	metadata: undefined,
};

export const useTaxStore = defineStore('taxStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		taxes: [] as Tax[],
		total_taxes: 0 as number,
		new_tax: structuredClone(initialEmptyTax),
		page_size: options_page_size[0],
		current_page: 1,
		errors: [] as string[],
	}),
	actions: {
		resetNewTax() {
			this.new_tax = structuredClone(initialEmptyTax);
		},

		async updatePageSize(size: number) {
			this.page_size = size;

			if (this.page_size > this.taxes.length) {
				this.current_page = 1;
				return;
			}

			this.getTaxes();
		},

		async updatePage(page: number) {
			this.current_page = page;

			if (this.current_page < 0 || this.taxes.length === this.total_taxes) {
				return;
			}

			this.getTaxes();
		},

		async getTaxes() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data, '@odata.count': total } = await $api.tax.getMany({
					$top: this.page_size,
					$count: true,
					$skip: (this.current_page - 1) * this.page_size,
				});

				if (data) {
					if (this.current_page > 1 && this.total_taxes > this.taxes.length) {
						this.taxes = [...this.taxes, ...data];
					} else {
						this.taxes = data;
					}

					this.total_taxes = total ?? 0;
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
				const data = await $api.tax.getSingle(code);

				return data.tax;
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async createTax() {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.tax.create(this.new_tax);

				if (data.tax) {
					successNotification(`${this.new_tax.code} - Tax Created !`);
					this.taxes.push(data.tax);
				}
				this.resetNewTax();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateTax(code: string, tax: Tax) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.tax.update(code, {
					description: tax.description,
					is_inclusive: tax.is_inclusive,
					is_active: tax.is_active,
					metadata: tax.metadata,
				});

				if (data.tax) {
					successNotification(`${data.tax.code} - Tax Updated !`);
					this.getTaxes();
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},

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
