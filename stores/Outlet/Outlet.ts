import { options_page_size } from '~/utils/options';
import type { Outlet } from '~/utils/types/outlet';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { OutletCreate } from '~/utils/types/form/outlet-creation';

const initialEmptyOutlet: OutletCreate = {
	code: undefined,
	description: undefined,
	address1: undefined,
	address2: undefined,
	address3: undefined,
	city: undefined,
	country_code: undefined,
	state: undefined,
	postal_code: undefined,
	longitude: undefined,
	latitude: undefined,
};

export const useOutletStore = defineStore('outletStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		outlets: [] as Outlet[],
		new_outlet: structuredClone(initialEmptyOutlet),
		page_size: options_page_size[0],
		current_page: 1,
		errors: [] as string[],
	}),
	actions: {
		resetNewOutlet() {
			this.new_outlet = structuredClone(initialEmptyOutlet);
		},

		updatePageSize(size: number) {
			this.page_size = size;
		},

		async getOutlets() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data } = await $api.outlet.getMany({
					$top: this.page_size,
					$skip: (this.current_page - 1) * this.page_size,
				});

				if (data) {
					this.outlets = data;
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
