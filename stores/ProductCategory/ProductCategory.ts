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
		total_categories: 0 as number,
		new_category: structuredClone(initialEmptyCategory),
		page_size: options_page_size[0] as number,
		current_page: 1,
		errors: [] as string[],
	}),
	actions: {
		resetNewCategory() {
			this.new_category = structuredClone(initialEmptyCategory);
		},

		async updatePageSize(size: number) {
			this.page_size = size;

			if (this.page_size > this.categories.length) {
				this.current_page = 1;
				return;
			}

			this.getCategories();
		},

		async updatePage(page: number) {
			this.current_page = page;

			if (this.current_page < 0 || this.categories.length === this.total_categories) {
				return;
			}

			this.getCategories();
		},

		async getCategories() {
			this.loading = true;
			const { $api } = useNuxtApp();

			try {
				const { data, '@odata.count': total } = await $api.category.getMany({
					$top: this.page_size,
					$count: true,
					$expand: 'products',
					$skip: (this.current_page - 1) * this.page_size,
				});

				if (data) {
					if (this.current_page > 1 && this.total_categories > this.categories.length) {
						this.categories = [...this.categories, ...data];
					} else {
						this.categories = data;
					}

					this.total_categories = total ?? 0;
				}
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
				if (this.new_category.images) {
					const resp = await $api.image.uploadMultiple(this.new_category.images, `${dir.categories}/${this.new_category.code}`);
					images = resp.images.map((image) => ({
						id: image.id,
						url: image.url,
					}));
				}

				let thumbnail: ImageReq | undefined;
				if (this.new_category.thumbnail) {
					const resp = await $api.image.upload(this.new_category.thumbnail, `${dir.categories}/${this.new_category.code}`);
					thumbnail = {
						id: resp.image.id,
						url: resp.image.url,
					};
				}

				const data = await $api.category.create({
					code: this.new_category.code,
					description: this.new_category.description,
					is_internal: this.new_category.is_internal,
					is_active: this.new_category.is_active,
					images: images,
					thumbnail: thumbnail,
					parent_category_code: this.new_category.parent_category_code,
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
