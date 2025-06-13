import { ProductStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { Product } from '~/utils/types/product';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ProductCreate } from '~/utils/types/form/product-creation';
import type { ImageReq } from '~/repository/modules/image/models/request/image.req';
import { dir } from '~/utils/constants/dir';

const initialEmptyProduct: ProductCreate = {
	code: undefined,
	name: undefined,
	short_desc: undefined,
	long_desc: undefined,
	is_active: true,
	is_discountable: true,
	is_giftcard: false,

	status: ProductStatus.PUBLISHED,

	// product types
	type: 1,

	// categories
	categories: [],

	// brands
	brands: [],

	// tags
	tags: [],

	// thumbnail
	thumbnail: undefined,

	// images
	images: undefined,

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
	metadata: undefined,
};

export const useProductStore = defineStore('productStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		newProduct: structuredClone(initialEmptyProduct),
		products: [] as Product[],
		current_product: undefined as Product | undefined,
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

		async getProduct(code: string): Promise<Product | undefined> {
			const { $api } = useNuxtApp();

			try {
				const data = await $api.product.fetchSingle(code);

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

		async createProduct(): Promise<boolean> {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				let images: ImageReq[] = [];
				if (this.newProduct.images) {
					const resp = await $api.image.uploadMultiple(this.newProduct.images, `${dir.products}/${this.newProduct.code}`);
					images = resp.images.map((image) => ({
						id: image.id,
						url: image.url,
					}));
				}

				let thumbnail: ImageReq | undefined;
				if (this.newProduct.thumbnail) {
					const resp = await $api.image.upload(this.newProduct.thumbnail, `${dir.products}/${this.newProduct.code}`);
					thumbnail = {
						id: resp.image.id,
						url: resp.image.url,
					};
				}

				const data = await $api.product.create({
					...this.newProduct,
					images: images,
					thumbnail: thumbnail,
				});

				if (data.products) {
					successNotification(`${this.newProduct.code} - Product Created !`);
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

		async updateProduct(new_thumbnail?: File, new_images?: File[]) {
			if (!this.current_product) {
				return;
			}
			const code = this.current_product.code!;
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				let images: ImageReq[] = [];
				if (new_images && new_images.length > 0) {
					const resp = await $api.image.uploadMultiple(new_images, `${dir.products}/${code}`);
					images = resp.images.map((image) => ({
						id: image.id,
						url: image.url,
					}));
				}

				let thumbnail: ImageReq | undefined;
				if (new_thumbnail) {
					const resp = await $api.image.upload(new_thumbnail, `${dir.products}/${code}`);
					thumbnail = {
						id: resp.image.id,
						url: resp.image.url,
					};
				}

				const data = await $api.product.update(code, {
					name: this.current_product.name,
					short_desc: this.current_product.short_desc ?? undefined,
					long_desc: this.current_product.long_desc ?? undefined,
					is_active: this.current_product.is_active,
					is_discountable: this.current_product.is_discountable,
					is_giftcard: this.current_product.is_giftcard,
					price_types: this.current_product.price_types,
					categories: this.current_product.categories,
					type: this.current_product.type,
					tags: this.current_product.tags,
					status: this.current_product.status,
					images: images,
					thumbnail: thumbnail,
					options: this.current_product.options,
					variants: this.current_product.variants,
				});

				if (data.product) {
					successNotification(`Product ${code} Updated !`);
					this.products = this.products.map((product) => {
						if (product.code === code) {
							return data.product;
						}
						return product;
					});

					// await this.getProducts();
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
	},
});
