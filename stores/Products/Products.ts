import { ProductStatus } from '~/utils/enum/product-status';
import { options_page_size } from '~/utils/options';
import type { ProductCreate } from '~/utils/types/form/product-creation';
import type { Product } from '~/utils/types/product';

const initialEmptyProduct: ProductCreate = {
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
	prices: [
		{
			currency: 'MYR',
			origSellPrice: undefined,
			costPrice: undefined,
			salePrice: undefined,
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
		async getProducts(skip: number = 0) {
			this.loading = true;
			console.log(skip);
			this.loading = false;
		},
		async addProduct() {
			this.loading = true;

			this.loading = false;
		},
		async deleteProduct(code: string) {
			this.loading = true;
			console.log(code);

			this.loading = false;
		},
	},
});
