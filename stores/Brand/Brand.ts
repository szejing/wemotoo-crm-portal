import { options_page_size } from '~/utils/options';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { Brand } from '~/utils/types/brand';
import type { BrandCreate } from '~/utils/types/form/brand-creation';

const initialEmptyBrand: BrandCreate = {
	code: '',
	description: '',
	is_active: true,
};

export const useBrandStore = defineStore('brandStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		new_brand: structuredClone(initialEmptyBrand),
		brands: [] as Brand[],
		total_brands: 0 as number,
		current_brand: undefined as Brand | undefined,
		page_size: options_page_size[0],
		current_page: 1,
		errors: [] as string[],
	}),
	actions: {
		resetNewBrand() {
			this.new_brand = structuredClone(initialEmptyBrand);
		},

		async updatePageSize(size: number) {
			this.page_size = size;

			if (this.page_size > this.brands.length) {
				this.current_page = 1;
				return;
			}

			this.getBrands();
		},

		async updatePage(page: number) {
			this.current_page = page;

			if (this.current_page < 0 || this.brands.length === this.total_brands) {
				return;
			}

			this.getBrands();
		},

		async getBrand(code: string): Promise<Brand | undefined> {
			const { $api } = useNuxtApp();

			try {
				const data = await $api.brand.getSingle(code);

				if (data.brand) {
					return data.brand;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			}
		},

		async getBrands() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data, '@odata.count': total } = await $api.brand.getMany({
					$top: this.page_size,
					$count: true,
					$skip: (this.current_page - 1) * this.page_size,
				});

				if (data) {
					if (this.current_page > 1 && this.total_brands > this.brands.length) {
						this.brands = [...this.brands, ...data];
					} else {
						this.brands = data;
					}

					this.total_brands = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async createBrand(): Promise<boolean> {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.brand.create({
					...this.new_brand,
				});

				if (data.brand) {
					successNotification(`${this.new_brand.code} - Brand Created !`);
					this.brands.push(data.brand);
				}

				this.resetNewBrand();
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

		async updateBrand(description: string, is_active: boolean) {
			if (!this.current_brand) {
				return;
			}
			const code = this.current_brand.code;
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.brand.update(code, {
					description: description,
					is_active: is_active,
				});

				if (data.brand) {
					successNotification(`Brand ${code} Updated !`);
					this.brands = this.brands.map((brand) => {
						if (brand.code === code) {
							return data.brand;
						}
						return brand;
					});
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},

		async deleteBrand(code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.brand.delete({ code });

				if (data.brand) {
					successNotification(`Brand #${data.brand.code} Deleted !`);

					const index = this.brands.findIndex((t) => t.code === data.brand.code);
					this.brands.splice(index, 1);
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
