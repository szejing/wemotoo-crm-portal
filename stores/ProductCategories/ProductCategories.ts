import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { ProductCategoryCreate } from '~/utils/types/form/product-category-creation';
import type { ProductCategory } from '~/utils/types/product-category';
import { failedNotification, successNotification } from '../AppUi/AppUi';

const initialEmptyCategory: ProductCategoryCreate = {
	code: undefined,
	name: undefined,
	description: undefined,

	is_active: true,

	is_internal: false,

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
		adding: false as boolean,
		updating: false as boolean,
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
		async addProductCategory(
			code: string,
			name: string,
			description: string | undefined,
			is_internal: boolean,
			is_active: boolean,
			images: string[] | undefined,
			thumbnail: string | undefined,
			parent_category_code: string | undefined,
		) {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productCategory.create({
					code: code,
					name: name,
					description: description ?? null,
					slug: null,
					is_internal: is_internal,
					is_active: is_active,
					images: images ?? null,
					thumbnail: thumbnail ?? null,
					parent_category_code: parent_category_code ?? null,
				});

				if (data.productCategory) {
					successNotification(`${name} - Product Category Created !`);
					this.productCategories.push(data.productCategory);
				}
				this.resetNewProductCategory();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},
		async updateProductCategory(category: ProductCategory) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productCategory.update(category.code, {
					name: category.name,
					description: category.description ?? null,
					slug: category.slug ?? null,
					is_internal: category.is_internal,
					is_active: category.is_active,
					images: category.images ?? null,
					thumbnail: category.thumbnail ?? null,
					parent_category_code: category.parent_category?.code ?? null,
				});

				if (data.productCategory) {
					successNotification(`Product Category Updated !`);
					this.getCategories();
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},
		async deleteProductCategory(code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productCategory.delete({ code });

				if (data.category_code) {
					successNotification(`Product Category Deleted !`);

					const index = this.productCategories.findIndex((catg) => catg.code === data.category_code);
					this.productCategories.splice(index, 1);
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
