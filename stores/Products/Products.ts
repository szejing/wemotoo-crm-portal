import { ProductStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { Product } from '~/utils/types/product';
import { failedNotification, successNotification } from '../AppUi/AppUi';

const initialEmptyProduct: Product = {
	code: undefined,
	name: undefined,
	short_desc: undefined,
	long_desc: undefined,
	is_active: true,
	is_discountable: true,
	is_giftcard: false,

	status: ProductStatus.DRAFT,

	// product types
	type: 1,

	// categories
	categories: [],

	// tags
	tags: [],

	// thumbnail
	thumbnail: undefined,

	// galleries
	galleries: undefined,

	// price
	price_types: [
		{
			id: undefined,
			currency_code: 'MYR',
			orig_sell_price: undefined,
			cost_price: undefined,
			sale_price: undefined,
		},
	],

	// variants
	options: [],
	variants: [],

	// metadata
	metadata: null,
};

export const useProductStore = defineStore('productStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		newProduct: structuredClone(initialEmptyProduct),
		products: [] as Product[],
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewProduct() {
			this.newProduct = structuredClone(initialEmptyProduct);
		},

		updatePageSize(size: number) {
			this.pageSize = size;
		},

		async getProducts() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.product.fetchMany();

				if (data.products) {
					this.products = data.products;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async addProduct(product: Product): Promise<boolean> {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.product.create(product);

				if (data.products) {
					successNotification(`${product.code} - Product Created !`);
					this.products = data.products;
				}

				this.resetNewProduct();
				return true;
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				return false;
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateProduct(code: string, product: Product) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.product.update(code, {
					name: product.name,
					short_desc: product.short_desc ?? undefined,
					long_desc: product.long_desc ?? undefined,
					is_active: product.is_active,
					is_discountable: product.is_discountable,
					is_giftcard: product.is_giftcard,
					price_types: product.price_types,
					categories: product.categories,
					type: product.type,
					tags: product.tags,
					status: product.status,
					galleries: product.galleries ?? undefined,
					thumbnail: product.thumbnail ?? undefined,
					options: product.options,
					variants: product.variants,
				});

				if (data.product) {
					successNotification(`Product Updated !`);
					this.getProducts();
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},

		async deleteProduct(code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.product.delete({ code });

				if (data.product) {
					successNotification(`Product #${data.product.code} Deleted !`);

					const index = this.products.findIndex((t) => t.code === data.product.code);
					this.products.splice(index, 1);
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
