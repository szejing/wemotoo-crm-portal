import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { ProductCategoryCreate } from '~/utils/types/form/product-category-creation';
import type { ProductCategory } from '~/utils/types/product-category';

const initialEmptyCategory: ProductCategoryCreate = {
	code: undefined,
	name: undefined,
	description: undefined,

	// thumbnail
	thumbnail: undefined,

	// galleries
	images: undefined,

	// parent category
	parent_category: undefined,
};

export const useProductCategoriesStore = defineStore({
	id: 'productCategoriesStore',
	state: () => ({
		loading: false as boolean,
		productCategories: [] as ProductCategory[],
		newProductCategory: structuredClone(initialEmptyCategory),
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewProductCategory() {
			this.newProductCategory = structuredClone(initialEmptyCategory);
		},
		updatePageSize(size: number) {
			this.pageSize = size;
		},
		async getCategories() {
			this.loading = true;
			const { $api } = useNuxtApp();

			try {
				await $api.productCategory
					.fetchMany()
					.then((data) => {
						this.productCategories = data.productCategories;
					})
					.catch((error) => {
						console.error(error);
					});
			} catch (err: any) {
				console.error(err);
			} finally {
				this.loading = false;
			}
		},
		async addProductCategorie(categories: ProductCategory) {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			this.productCategories.push(categories);
			this.loading = false;
		},
		async updateProductCategorie(categories: ProductCategory) {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const index = this.productCategories.findIndex((c) => c.id === categories.id);
			if (index > -1) {
				this.productCategories[index] = categories;
			}
			this.loading = false;
		},
		async deleteProductCategorie(id: string) {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			this.productCategories = this.productCategories.filter((c) => c.id !== id);
			this.loading = false;
		},
	},
});
