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
		newBrand: structuredClone(initialEmptyBrand),
		brands: [] as Brand[],
		current_brand: undefined as Brand | undefined,
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewBrand() {
			this.newBrand = structuredClone(initialEmptyBrand);
		},

		updatePageSize(size: number) {
			this.pageSize = size;
		},

		async getBrand(code: string): Promise<Brand | undefined> {
			const { $api } = useNuxtApp();

			try {
				const data = await $api.brand.fetchSingle(code);

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
				const data = await $api.brand.fetchMany();

				if (data.brands) {
					this.brands = data.brands;
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
					...this.newBrand,
				});

				if (data.brand) {
					successNotification(`${this.newBrand.code} - Brand Created !`);
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
