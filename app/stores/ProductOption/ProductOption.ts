import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { ProductOptionCreate } from '~/utils/types/form/product-option-creation';
import type { ProductOption } from '~/utils/types/product-option';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ErrorResponse } from '~/repository/base/error';
import type { ProductOptionValue } from '~/utils/types/product-option-value';
import { defaultProductOptionRelations } from 'wemotoo-common';
import type { BaseODataReq } from '~/repository/base/base.req';

type ProductOptionFilter = {
	query: string;
	page_size: number;
	current_page: number;
};

const initialEmptyOption: ProductOptionCreate = {
	name: undefined,
	values: undefined,
};

const initialEmptyProductOptionFilter: ProductOptionFilter = {
	query: '',
	page_size: options_page_size[0] as number,
	current_page: 1,
};

export const useProductOptionStore = defineStore('productOptionStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		exporting: false as boolean,
		prod_option: [] as ProductOption[],
		total_options: 0 as number,
		new_prod_option: structuredClone(initialEmptyOption),
		filter: initialEmptyProductOptionFilter,
		errors: [] as string[],
	}),
	actions: {
		resetNewProductOption() {
			this.new_prod_option = structuredClone(initialEmptyOption);
		},

		async updatePageSize(size: number) {
			this.filter.page_size = size;

			if (this.filter.page_size > this.prod_option.length) {
				this.filter.current_page = 1;
				return;
			}

			this.getOptions();
		},

		async updatePage(page: number) {
			this.filter.current_page = page;

			if (this.filter.current_page < 0 || this.prod_option.length === this.total_options) {
				return;
			}

			this.getOptions();
		},

		currentProductOptions() {
			return JSON.parse(JSON.stringify(this.prod_option));
		},

		async getOptions() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const queryParams: BaseODataReq = {
					$top: this.filter.page_size,
					$count: true,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$expand: filterRelations(defaultProductOptionRelations).join(','),
					$orderby: 'updated_at desc',
				};

				if (this.filter.query) {
					const queryFilter = `(name contains '${this.filter.query}')`;
					queryParams.$filter = queryFilter;
				}

				const { data, '@odata.count': total } = await $api.productOption.getMany(queryParams);

				if (data) {
					this.prod_option = data;
					this.total_options = total ?? 0;
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process product option';
				failedNotification(message);
			} finally {
				this.loading = false;
			}
		},
		async addProductOption(name: string, values: string[]) {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.productOption.create({ name, values: values.map((v) => ({ value: v })) });

				if (data.productOption) {
					successNotification(`${name} - Product Option Created !`);
					this.prod_option.push(data.productOption);
				}
				this.resetNewProductOption();
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process product option';
				failedNotification(message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},
		async updateProductOption(optionId: number, name: string, values: ProductOptionValue[]) {
			this.updating = true;

			const { $api } = useNuxtApp();

			values.forEach((v) => {
				v.metadata = undefined;
			});

			try {
				const data = await $api.productOption.update(optionId, {
					name,
					values,
				});

				if (data.productOption) {
					successNotification(`Product Option Updated !`);
					this.getOptions();
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process product option';
				failedNotification(message);
			} finally {
				this.updating = false;
			}
		},
		async deleteProductOption(option: ProductOption) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				await $api.productOption.delete({ id: option.id });

				successNotification(`Option #${option.name} Deleted !`);

				const index = this.prod_option.findIndex((t) => t.id === option.id);
				this.prod_option.splice(index, 1);
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process product option';
				failedNotification(message);
			} finally {
				this.loading = false;
			}
		},
	},
});
