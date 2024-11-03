import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { ProductTagCreate } from '~/utils/types/form/product-tag-creation';
import type { ProductTag } from '~/utils/types/product-tag';
import { failedNotification, successNotificateion } from '../AppUi/AppUi';

const initialEmptyTag: ProductTagCreate = {
	value: undefined,
};

export const useProductTagsStore = defineStore({
	id: 'productTagsStore',
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
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
				await $api.productTag
					.fetchMany()
					.then((data) => {
						this.productTags = data.productTags;
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

		async addProductTag(value: string) {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				await $api.productTag.create({ value }).then((data) => {
					if (data.productTag) {
						successNotificateion(`${value} - Product Tag Created !`);
						this.productTags.push(data.productTag);
					}
				});
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = true;
				this.resetNewProductTag();
			}
		},

		async updateProductTag(tag: ProductTag) {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const index = this.productTags.findIndex((c) => c.id === tag.id);
			if (index > -1) {
				this.productTags[index] = tag;
			}
			this.loading = false;
		},

		async deleteProductTag(id: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				await $api.productTag
					.delete({ id: parseInt(id) })
					.then((data) => {
						if (data.productTag) {
							successNotificateion(`Product Tag Deleted !`);

							const index = this.productTags.findIndex((t) => t.id === data.productTag.toString());
							this.productTags.splice(index, 1);
						}
					})
					.catch((err) => {
						console.error(err);

						failedNotification(err.message);
					});
			} catch (err: any) {
				console.error(err);
			} finally {
				this.loading = false;
			}
		},
	},
});
