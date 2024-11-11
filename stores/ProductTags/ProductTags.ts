import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { ProductTagCreate } from '~/utils/types/form/product-tag-creation';
import type { ProductTag } from '~/utils/types/product-tag';
import { failedNotification, successNotification } from '../AppUi/AppUi';

const initialEmptyTag: ProductTagCreate = {
	value: undefined,
};

export const useProductTagsStore = defineStore({
	id: 'productTagsStore',
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		productTags: [] as ProductTag[],
		newProductTag: structuredClone(initialEmptyTag),
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewProductTag() {
			this.newProductTag = structuredClone(initialEmptyTag);
		},

		updatePageSize(size: number) {
			this.pageSize = size;
		},

		async getTags() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.productTag.fetchMany();

				if (data.productTags) {
					this.productTags = data.productTags;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async addProductTag(value: string) {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productTag.create({ value });

				if (data.productTag) {
					successNotification(`${value} - Product Tag Created !`);
					this.productTags.push(data.productTag);
				}
				this.resetNewProductTag();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateProductTag(id: number, tag: ProductTag) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productTag.update(id, {
					value: tag.value,
				});

				if (data.productTag) {
					successNotification(`Product Tag Updated !`);
					this.getTags();
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},

		async deleteProductTag(id: number) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productTag.delete({ id });

				if (data.tag_id) {
					successNotification(`Product Tag Deleted !`);

					const index = this.productTags.findIndex((t) => t.id === data.tag_id);
					this.productTags.splice(index, 1);
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
