import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { ProductOption } from '~/utils/types/product-option';

const initial: ProductOption[] = [];

export const useProductOptionsStore = defineStore({
	id: 'productOptionsStore',
	state: () => ({
		loading: false as boolean,
		productOptions: structuredClone(initial),
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		updatePageSize(size: number) {
			this.pageSize = size;
		},
		async getOptions() {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			this.productOptions = structuredClone(initial);
			this.loading = false;
		},
		async addProductOption(option: ProductOption) {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			this.productOptions.push(option);
			this.loading = false;
		},
		async updateProductOption(option: ProductOption) {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const index = this.productOptions.findIndex((c) => c.id === option.id);
			if (index > -1) {
				this.productOptions[index] = option;
			}
			this.loading = false;
		},
		async deleteProductOption(id: string) {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			this.productOptions = this.productOptions.filter((c) => c.id !== id);
			this.loading = false;
		},
	},
});
