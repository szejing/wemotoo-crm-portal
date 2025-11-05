import { options_page_size } from '~/utils/options';
import type { Outlet } from '~/utils/types/outlet';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { OutletCreate } from '~/utils/types/form/outlet-creation';
import type { BaseODataReq } from '~/repository/base/base.req';

const initialEmptyOutlet: OutletCreate = {
	code: '',
	description: '',
	address1: '',
	address2: '',
	address3: '',
	city: '',
	country_code: '',
	state: '',
	postal_code: '',
	longitude: undefined,
	latitude: undefined,
	tax_rule_code: undefined,
};

export const useOutletStore = defineStore('outletStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		exporting: false as boolean,
		outlets: [] as Outlet[],
		total_outlets: 0 as number,
		new_outlet: structuredClone(initialEmptyOutlet),
		errors: [] as string[],
		filter: {
			query: '',
			page_size: options_page_size[0] as number,
			current_page: 1,
		},
	}),
	actions: {
		resetNewOutlet() {
			this.new_outlet = structuredClone(initialEmptyOutlet);
		},

		async updatePageSize(size: number) {
			this.filter.page_size = size;

			if (this.filter.page_size > this.outlets.length) {
				this.filter.current_page = 1;
				return;
			}

			this.getOutlets();
		},

		async updatePage(page: number) {
			this.filter.current_page = page;

			if (this.filter.current_page < 0 || this.outlets.length === this.total_outlets) {
				return;
			}

			this.getOutlets();
		},

		async getOutlets() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				let filter = '';

				if (this.filter.query) {
					const queryFilter = `(code contains '${this.filter.query}' or description contains '${this.filter.query}')`;
					filter = filter ? `${filter} and ${queryFilter}` : queryFilter;
				}

				const queryParams: BaseODataReq = {
					$top: this.filter.page_size,
					$count: true,
					$expand: 'tax_rule',
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
				};

				if (filter) {
					queryParams.$filter = filter;
				}

				const { data, '@odata.count': total } = await $api.outlet.getMany(queryParams);

				if (data) {
					if (this.filter.current_page > 1 && this.total_outlets > this.outlets.length) {
						this.outlets = [...this.outlets, ...data];
					} else {
						this.outlets = data;
					}

					this.total_outlets = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async getOutletByCode(code: string) {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.outlet.getSingle(code);

				return data.outlet;
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async createOutlet() {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.outlet.create(this.new_outlet);

				if (data.outlet) {
					successNotification(`${this.new_outlet.code} - Outlet Created !`);
					this.outlets.push(data.outlet);
				}
				this.resetNewOutlet();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateOutlet(code: string, outlet: Outlet) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.outlet.update(code, {
					description: outlet.description,
					address1: outlet.address1,
					address2: outlet.address2 || undefined,
					address3: outlet.address3 || undefined,
					city: outlet.city,
					country_code: outlet.country_code,
					state: outlet.state,
					postal_code: outlet.postal_code,
					longitude: outlet.longitude || undefined,
					latitude: outlet.latitude || undefined,
					tax_rule: outlet.tax_rule as string | undefined,
				});

				if (data.outlet) {
					successNotification(`Outlet Updated !`);
					this.getOutlets();
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},

		async deleteOutlet(code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.outlet.delete({ code });

				if (data.outlet.code) {
					successNotification(`Outlet #${data.outlet.code} Deleted !`);

					const index = this.outlets.findIndex((t) => t.code === data.outlet.code);
					this.outlets.splice(index, 1);
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
