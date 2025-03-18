import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { CategoryCreate } from '~/utils/types/form/category-creation';
import type { Category } from '~/utils/types/category';
import { failedNotification, successNotification } from '../AppUi/AppUi';

const initialEmptyCategory: CategoryCreate = {
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

export const useCategoriesStore = defineStore('categoriesStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		categories: [] as Category[],
		newCategory: structuredClone(initialEmptyCategory),
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewCategory() {
			this.newCategory = structuredClone(initialEmptyCategory);
		},

		updatePageSize(size: number) {
			this.pageSize = size;
		},

		async getCategories() {
			this.loading = true;
			const { $api } = useNuxtApp();

			try {
				await $api.category
					.fetchMany()
					.then((data) => {
						this.categories = data.categories;
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
		async addCategory(
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
				const data = await $api.category.create({
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

				if (data.category) {
					successNotification(`${name} - Category Created !`);
					this.categories.push(data.category);
				}
				this.resetNewCategory();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},
		async updateCategory(category: Category) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.category.update(category.code, {
					name: category.name,
					description: category.description ?? null,
					slug: category.slug ?? null,
					is_internal: category.is_internal,
					is_active: category.is_active,
					images: category.images ?? null,
					thumbnail: category.thumbnail ?? null,
					parent_category_code: category.parent_category?.code ?? null,
				});

				if (data.category) {
					successNotification(`Category Updated !`);
					this.getCategories();
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},
		async deleteCategory(code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.category.delete({ code });

				if (data.category.code) {
					successNotification(`Category Deleted !`);

					const index = this.categories.findIndex((catg) => catg.code === data.category.code);
					this.categories.splice(index, 1);
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
