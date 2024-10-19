import { ProductStatus } from '~/utils/enum/product-status';
import { options_page_size } from '~/utils/options';
import type { ProductCreate } from '~/utils/types/form/product-creation';

const initialEmptyProduct: ProductCreate = {
	code: undefined,
	title: undefined,
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
			currency: 'RM',
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
		async deleteProduct(id: string) {
			this.loading = true;
			console.log(id);

			this.loading = false;
		},
	},
});
