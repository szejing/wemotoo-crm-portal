import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { ProductOptionCreate } from '~/utils/types/form/product-option-creation';
import type { ProductOption } from '~/utils/types/product-option';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ProductOptionValue } from '~/utils/types/product-option-value';

const initialEmptyOption: ProductOptionCreate = {
	name: undefined,
	values: undefined,
};

export const useProductOptionStore = defineStore('productOptionStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		productOptions: [] as ProductOption[],
		newProductOption: structuredClone(initialEmptyOption),
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewProductOption() {
			this.newProductOption = structuredClone(initialEmptyOption);
		},
		updatePageSize(size: number) {
			this.pageSize = size;
		},
		currentProductOptions() {
			return JSON.parse(JSON.stringify(this.productOptions));
		},
		async getOptions() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.productOption.fetchMany();

				if (data.productOptions) {
					this.productOptions = data.productOptions;
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
					this.productOptions.push(data.productOption);
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

					const index = this.productOptions.findIndex((t) => t.id === data.productOption.id);
					this.productOptions.splice(index, 1);
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
