import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';

import type { ProductType } from '~/utils/types/product-type';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ProductTypeCreate } from '~/utils/types/form/product-type-creation';

const initialEmptyProductType: ProductTypeCreate = {
	value: undefined,
};

export const useProductTypesStore = defineStore('productTypesStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		productTypes: [] as ProductType[],
		newProductType: structuredClone(initialEmptyProductType),
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewProductType() {
			this.newProductType = structuredClone(initialEmptyProductType);
		},

		updatePageSize(size: number) {
			this.pageSize = size;
		},

		async getProductTypes() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.productType.fetchMany();

				if (data.productTypes) {
					this.productTypes = data.productTypes;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async addProductType(value: string) {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productType.create({ value });

				if (data.productType) {
					successNotification(`${value} - Product Type Created !`);
					this.productTypes.push(data.productType);
				}
				this.resetNewProductType();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateProductType(id: number, productType: ProductType) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productType.update(id, {
					value: productType.value,
				});

				if (data.productType) {
					successNotification(`Product Type Updated !`);
					this.getProductTypes();
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},

		async deleteProductType(id: number) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productType.delete({ id });

				if (data.productType) {
					successNotification(`Product Type Deleted !`);

					const index = this.productTypes.findIndex((t) => t.id === data.productType.id);
					this.productTypes.splice(index, 1);
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
