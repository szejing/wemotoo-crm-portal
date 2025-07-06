import { defaultSimpleProductRelations, ProductStatus } from 'wemotoo-common';
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
		new_product: structuredClone(initialEmptyProduct),
		products: [] as Product[],
		total_products: 0 as number,
		current_product: undefined as Product | undefined,
		page_size: options_page_size[0],
		current_page: 1,
		errors: [] as string[],
	}),

	actions: {
		resetNewProduct() {
			this.new_product = structuredClone(initialEmptyProduct);
		},

		async updatePageSize(size: number) {
			this.page_size = size;

			if (this.page_size > this.products.length) {
				this.current_page = 1;
				return;
			}

			this.getProducts();
		},

		async updatePage(page: number) {
			this.current_page = page;

			if (this.current_page < 0 || this.products.length === this.total_products) {
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
				const { data, '@odata.count': total } = await $api.product.getMany({
					$top: this.page_size,
					$count: true,
					$skip: (this.current_page - 1) * this.page_size,
					$expand: defaultSimpleProductRelations.join(','),
				});

				if (data) {
					if (this.current_page > 1 && this.total_products > this.products.length) {
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
					const resp = await $api.image.uploadMultiple(this.new_product.images, `${dir.products}/${this.new_product.code}`);
					images = resp.images.map((image) => ({
						id: image.id,
						url: image.url,
					}));
				}

				let thumbnail: ImageReq | undefined;
				if (this.new_product.thumbnail) {
					const resp = await $api.image.upload(this.new_product.thumbnail, `${dir.products}/${this.new_product.code}`);
					thumbnail = {
						id: resp.image.id,
						url: resp.image.url,
					};
				}

				const data = await $api.product.create({
					...this.new_product,
					images: images,
					thumbnail: thumbnail,
				});

				if (data.products) {
					successNotification(`${this.new_product.code} - Product Created !`);
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
