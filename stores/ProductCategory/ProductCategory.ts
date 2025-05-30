import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { CategoryCreate } from '~/utils/types/form/category-creation';
import type { Category } from '~/utils/types/category';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import { dir } from '~/utils/constants/dir';
import type { ImageReq } from '~/repository/modules/image/models/request/image.req';

const initialEmptyCategory: CategoryCreate = {
	code: '',
	description: undefined,

	is_active: true,

	is_internal: false,

	// thumbnail
	thumbnail: undefined,

	// images
	images: undefined,

	// parent category
	parent_category_code: undefined,
};

export const useProductCategoryStore = defineStore('productCategoryStore', {
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
		async createCategory() {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				let images: ImageReq[] = [];
				if (this.newCategory.images) {
					const resp = await $api.image.uploadMultiple(this.newCategory.images, `${dir.categories}/${this.newCategory.code}`);
					images = resp.images.map((image) => ({
						id: image.id,
						url: image.url,
					}));
				}

				let thumbnail: ImageReq | undefined;
				if (this.newCategory.thumbnail) {
					const resp = await $api.image.upload(this.newCategory.thumbnail, `${dir.categories}/${this.newCategory.code}`);
					thumbnail = {
						id: resp.image.id,
						url: resp.image.url,
					};
				}

				const data = await $api.category.create({
					code: this.newCategory.code,
					description: this.newCategory.description,
					is_internal: this.newCategory.is_internal,
					is_active: this.newCategory.is_active,
					images: images,
					thumbnail: thumbnail,
					parent_category_code: this.newCategory.parent_category_code,
				});

				if (data.category) {
					successNotification(`${data.category.code} - Category Created !`);
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
		async updateCategory(
			code: string,
			description: string,
			is_active: boolean,
			is_internal: boolean,
			parent_category: Category,
			new_thumbnail?: File,
			new_images?: File[],
		) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				let images: ImageReq[] = [];
				if (new_images) {
					const resp = await $api.image.uploadMultiple(new_images, `${dir.categories}/${code}`);
					images = resp.images.map((image) => ({
						id: image.id,
						url: image.url,
					}));
				}

				let thumbnail: ImageReq | undefined;
				if (new_thumbnail) {
					const resp = await $api.image.upload(new_thumbnail, `${dir.categories}/${code}`);
					thumbnail = {
						id: resp.image.id,
						url: resp.image.url,
					};
				}

				const data = await $api.category.update(code, {
					description: description,
					is_internal: is_internal,
					is_active: is_active,
					images: images,
					thumbnail: thumbnail,
					parent_category_code: parent_category?.code,
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
					successNotification(`Category #${data.category.code} Deleted !`);

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
