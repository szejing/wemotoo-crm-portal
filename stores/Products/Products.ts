import { ProductStatus } from '~/utils/enum/product-status';
import { options_page_size } from '~/utils/options';
import type { Product } from '~/utils/types/product';
import { failedNotification, successNotification } from '../AppUi/AppUi';

const initialEmptyProduct: Product = {
	code: undefined,
	name: undefined,
	subtitle: undefined,
	description: undefined,
	is_active: true,
	is_service: false,
	is_discountable: true,
	is_giftcard: false,

	status: ProductStatus.DRAFT,

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
			currency_code: 'MYR',
			orig_sell_price: undefined,
			cost_price: undefined,
			sale_price: undefined,
		},
	],

	// variants
	options: [],
	variants: [],
};

export const useProductStore = defineStore({
	id: 'productStore',
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
		async addProduct(input: Product) {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.product.create(input);

				if (data.product) {
					successNotification(`${data.product.code} - Product Created !`);
					this.products.push(data.product);
				}
				this.resetNewProduct();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateProduct(code: string, input: Product) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.product.update(code, input);

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

				if (data.code) {
					successNotification(`Product Tag Deleted !`);

					const index = this.products.findIndex((t) => t.code === data.code);
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
