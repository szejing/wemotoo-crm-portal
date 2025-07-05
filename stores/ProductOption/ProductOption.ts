import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { ProductOptionCreate } from '~/utils/types/form/product-option-creation';
import type { ProductOption } from '~/utils/types/product-option';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ProductOptionValue } from '~/utils/types/product-option-value';
import { defaultProductOptionRelations } from 'wemotoo-common';

const initialEmptyOption: ProductOptionCreate = {
	name: undefined,
	values: undefined,
};

export const useProductOptionStore = defineStore('productOptionStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		prod_option: [] as ProductOption[],
		new_prod_option: structuredClone(initialEmptyOption),
		page_size: options_page_size[0],
		current_page: 1,
		errors: [] as string[],
	}),
	actions: {
		resetNewProductOption() {
			this.new_prod_option = structuredClone(initialEmptyOption);
		},
		updatePageSize(size: number) {
			this.page_size = size;
		},
		currentProductOptions() {
			return JSON.parse(JSON.stringify(this.prod_option));
		},
		async getOptions() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data } = await $api.productOption.getMany({
					$top: this.page_size,
					$skip: (this.current_page - 1) * this.page_size,
					$expand: filterRelations(defaultProductOptionRelations).join(','),
				});

				if (data) {
					this.prod_option = data;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},
		async addProductOption(name: string, values: string[]) {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productOption.create({ name, values: values.map((v) => ({ value: v })) });

				if (data.productOption) {
					successNotification(`${name} - Product Option Created !`);
					this.prod_option.push(data.productOption);
				}
				this.resetNewProductOption();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},
		async updateProductOption(optionId: number, name: string, values: ProductOptionValue[]) {
			this.updating = true;

			const { $api } = useNuxtApp();

			values.forEach((v) => {
				v.metadata = undefined;
			});

			try {
				const data = await $api.productOption.update(optionId, {
					name,
					values,
				});

				if (data.productOption) {
					successNotification(`Product Option Updated !`);
					this.getOptions();
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},
		async deleteProductOption(id: number) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productOption.delete({ id });

				if (data.productOption) {
					successNotification(`Option #${data.productOption.name} Deleted !`);

					const index = this.prod_option.findIndex((t) => t.id === data.productOption.id);
					this.prod_option.splice(index, 1);
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
