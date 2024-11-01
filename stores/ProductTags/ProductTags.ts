import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { ProductTagCreate } from '~/utils/types/form/product-tag-creation';
import type { ProductTag } from '~/utils/types/product-tag';

const initialEmptyTag: ProductTagCreate = {
	name: undefined,
};

export const useProductTagsStore = defineStore({
	id: 'productTagsStore',
	state: () => ({
		loading: false as boolean,
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
				$api.productTag
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
			this.loading = false;
		},
		async addProductTag(tag: ProductTag) {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			this.productTags.push(tag);
			this.loading = false;
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
			await new Promise((resolve) => setTimeout(resolve, 1000));
			this.productTags = this.productTags.filter((c) => c.id !== id);
			this.loading = false;
		},
	},
});
