import { defaultSimpleProductRelations, ProductStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { Product } from '~/utils/types/product';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ProductCreate } from '~/utils/types/form/product-creation';
import type { ImageReq } from '~/repository/modules/image/models/request/image.req';
import { dir } from '~/utils/constants/dir';
import type { BaseODataReq } from '~/repository/base/base.req';

type ProductFilter = {
	query: string;
	status: ProductStatus | undefined;
	page_size: number;
	current_page: number;
};

const initialEmptyProductFilter: ProductFilter = {
	query: '',
	status: undefined,
	page_size: options_page_size[0] as number,
	current_page: 1,
};

const initialEmptyProduct: ProductCreate = {
	code: undefined,
	name: '',
	short_desc: undefined,
	long_desc: undefined,
	is_active: true,
	is_discountable: true,
	is_giftcard: false,

	status: ProductStatus.PUBLISHED,

	// product types
	type_id: 1,

	// categories
	category_codes: [],

	// brands
	brand_codes: [],

	// tags
	tag_ids: [],

	// thumbnail
	thumbnail: undefined,

	// images
	images: undefined,

	// price
	price_types: [
		{
			id: undefined,
			currency_code: 'MYR',
			orig_sell_price: 0,
			cost_price: undefined,
			sale_price: undefined,
		},
	],

	// variants
	options: [],
	variants: [],

	// metadata
	metadata: undefined,
};

export const useProductStore = defineStore('productStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		exporting: false as boolean,
		new_product: structuredClone(initialEmptyProduct),
		products: [] as Product[],
		total_products: 0 as number,
		current_product: undefined as Product | undefined,
		filter: initialEmptyProductFilter,
		errors: [] as string[],
	}),

	actions: {
		resetNewProduct() {
			this.new_product = structuredClone(initialEmptyProduct);
		},

		async updatePageSize(size: number) {
			this.filter.page_size = size;

			if (this.filter.page_size > this.products.length) {
				this.filter.current_page = 1;
				return;
			}

			this.getProducts();
		},

		async updatePage(page: number) {
			this.filter.current_page = page;

			if (this.filter.current_page < 0 || this.products.length === this.total_products) {
				return;
			}

			this.getProducts();
		},

		async getProduct(code: string): Promise<Product | undefined> {
			const { $api } = useNuxtApp();

			try {
				const data = await $api.product.getSingle(code);

				if (data.product) {
					return data.product;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			}
		},

		async getProducts() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { query, status } = this.filter;

				let filter = '';

				// Add status filter if provided
				if (status) {
					filter = `status eq '${status}'`;
				}

				// Add query filter if provided
				if (query) {
					const queryFilter = `(code contains '${query}' or name contains '${query}' or short_desc contains '${query}')`;
					filter = filter ? `${filter} and ${queryFilter}` : queryFilter;
				}

				const queryParams: BaseODataReq = {
					$top: this.filter.page_size,
					$count: true,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$expand: defaultSimpleProductRelations.join(','),
					$orderby: 'updated_at desc',
				};

				// Only add $filter if it's not empty
				if (filter) {
					queryParams.$filter = filter;
				}

				const { data, '@odata.count': total } = await $api.product.getMany(queryParams);

				if (data) {
					if (this.filter.current_page > 1 && this.total_products > this.products.length) {
						this.products = [...this.products, ...data];
					} else {
						this.products = data;
					}

					this.total_products = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async createProduct(): Promise<boolean> {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				let images: ImageReq[] = [];
				if (this.new_product.images) {
					const resp = await $api.image.uploadMultiple(this.new_product.images as File[], `${dir.products}/${this.new_product.code}`);
					images = resp.images.map((image) => ({
						id: image.id,
						url: image.url,
					}));
				}

				let thumbnail: ImageReq | undefined;
				if (this.new_product.thumbnail) {
					const resp = await $api.image.upload(this.new_product.thumbnail as File, `${dir.products}/${this.new_product.code}`);
					thumbnail = {
						id: resp.image.id,
						url: resp.image.url,
					};
				}

				const data = await $api.product.create({
					...this.new_product,
					images,
					thumbnail,
				});

				if (data.products) {
					successNotification(`${this.new_product.code} - Product Created !`);
					this.products = data.products;
					return true;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				return false;
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateProduct(new_thumbnail?: File, new_images?: File[]) {
			if (!this.current_product) {
				return;
			}
			const code = this.current_product.code!;
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				// let images: ImageReq[] = [];
				// if (new_images && new_images.length > 0) {
				// 	const resp = await $api.image.uploadMultiple(new_images, `${dir.products}/${code}`);
				// 	images = resp.images.map((image) => ({
				// 		id: image.id,
				// 		url: image.url,
				// 	}));
				// }

				// let thumbnail: ImageReq | undefined;
				// if (new_thumbnail) {
				// 	const resp = await $api.image.upload(new_thumbnail, `${dir.products}/${code}`);
				// 	thumbnail = {
				// 		id: resp.image.id,
				// 		url: resp.image.url,
				// 	};
				// }

				// const data = await $api.product.update(code, {
				// 	name: this.current_product.name,
				// 	short_desc: this.current_product.short_desc ?? undefined,
				// 	long_desc: this.current_product.long_desc ?? undefined,
				// 	is_active: this.current_product.is_active,
				// 	is_discountable: this.current_product.is_discountable,
				// 	is_giftcard: this.current_product.is_giftcard,
				// 	price_types: this.current_product.price_types,
				// 	category_codes: this.current_product.categories.map((category) => category.code),
				// 	type_id: this.current_product.type.id,
				// 	tag_ids: this.current_product.tags.map((tag) => tag.id),
				// 	status: this.current_product.status,
				// 	thumbnail: thumbnail,
				// 	images: images,
				// });

				// if (data.product) {
				// 	successNotification(`Product ${code} Updated !`);
				// 	this.products = this.products.map((product) => {
				// 		if (product.code === code) {
				// 			return data.product;
				// 		}
				// 		return product;
				// 	});
				// }

				return true;
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

		async deleteVariant(code: string, variant_code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.product.deleteVariant(code, variant_code);

				if (data.product) {
					successNotification(`Variant #${variant_code} Deleted !`);

					this.products = this.products.map((product) => {
						if (product.code === code) {
							return data.product;
						}
						return product;
					});
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async exportProducts() {
			this.exporting = true;
			const { $api } = useNuxtApp();

			// try {
			// 	const data = await $api.product.exportProducts();
			// } catch (err: any) {
			// 	console.error(err);
			// 	failedNotification(err.message);
			// } finally {
			// 	this.exporting = false;
			// }
		},
	},
});
