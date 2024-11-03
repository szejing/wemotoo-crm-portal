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
					successNotificateion(`${value} - Product Tag Created !`);
					this.productTags.push(data.productTag);
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = true;
				this.resetNewProductTag();
			}
		},

		async updateProductTag(id: string, tag: ProductTag) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productTag.update(id, tag);

				if (data.productTag) {
					successNotificateion(`Product Tag Updated !`);

					// const index = this.productTags.findIndex((t) => t.id === data.productTag.toString());
					// this.productTags.splice(index, 1);
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async deleteProductTag(id: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productTag.delete({ id: parseInt(id) });

				if (data.productTag) {
					successNotificateion(`Product Tag Deleted !`);

					const index = this.productTags.findIndex((t) => t.id === data.productTag.toString());
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
