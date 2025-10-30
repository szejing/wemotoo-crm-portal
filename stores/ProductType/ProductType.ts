import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';

import type { ProductType } from '~/utils/types/product-type';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ProductTypeCreate } from '~/utils/types/form/product-type-creation';

const initialEmptyProductType: ProductTypeCreate = {
	value: undefined,
};

export const useProductTypeStore = defineStore('productTypeStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		prod_types: [] as ProductType[],
		total_prod_types: 0 as number,
		new_prod_type: structuredClone(initialEmptyProductType),
		page_size: options_page_size[0] as number,
		current_page: 1,
		errors: [] as string[],
	}),
	actions: {
		resetNewProductType() {
			this.new_prod_type = structuredClone(initialEmptyProductType);
		},

		async updatePageSize(size: number) {
			this.page_size = size;

			if (this.page_size > this.prod_types.length) {
				this.current_page = 1;
				return;
			}

			this.getProductTypes();
		},

		async updatePage(page: number) {
			this.current_page = page;

			if (this.current_page < 0 || this.prod_types.length === this.total_prod_types) {
				return;
			}

			this.getProductTypes();
		},

		async getProductTypes() {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const { data, '@odata.count': total } = await $api.productType.getMany({
					$top: this.page_size,
					$count: true,
					$skip: (this.current_page - 1) * this.page_size,
				});

				if (data) {
					if (this.current_page > 1 && this.total_prod_types > this.prod_types.length) {
						this.prod_types = [...this.prod_types, ...data];
					} else {
						this.prod_types = data;
					}

					this.total_prod_types = total ?? 0;
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
					this.prod_types.push(data.productType);
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

					const index = this.prod_types.findIndex((t) => t.id === data.productType.id);
					this.prod_types.splice(index, 1);
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
