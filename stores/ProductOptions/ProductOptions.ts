import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { ProductOptionCreate } from '~/utils/types/form/product-option-creation';
import type { ProductOption } from '~/utils/types/product-option';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ProductOptionValue } from '~/utils/types/product-option-value';

// const initial: ProductOption[] = [
// 	{
// 		id: '1',
// 		name: 'Color',
// 		values: ['Red', 'Blue', 'Green'],
// 	},
// 	{
// 		id: '2',
// 		name: 'Size',
// 		values: ['S', 'M', 'L'],
// 	},
// 	{
// 		id: '3',
// 		name: 'Material',
// 		values: ['Cotton', 'Polyester', 'Wool'],
// 	},
// 	{
// 		id: '4',
// 		name: 'Style',
// 		values: ['Casual', 'Formal', 'Sport'],
// 	},
// 	{
// 		id: '5',
// 		name: 'Pattern',
// 		values: ['Solid', 'Striped', 'Checkered'],
// 	},
// ];

const initialEmptyOption: ProductOptionCreate = {
	name: undefined,
	values: undefined,
};

export const useProductOptionsStore = defineStore({
	id: 'productOptionsStore',
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
		async updateProductOption(id: number, name: string, values: ProductOptionValue[]) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productOption.update(id, {
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
		async deleteProductOption(id: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productOption.delete({ id: parseInt(id) });

				if (data.option_id) {
					successNotification(`Product Option Deleted !`);

					const index = this.productOptions.findIndex((t) => t.id === data.option_id.toString());
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
