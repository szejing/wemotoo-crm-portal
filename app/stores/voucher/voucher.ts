import { options_page_size } from '~/utils/options';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { ErrorResponse } from '~/repository/base/error';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { CreateVoucherReq } from '~/repository/modules/voucher/models/request/create-voucher.req';
import type { UpdateVoucherReq } from '~/repository/modules/voucher/models/request/update-voucher.req';
import type { Voucher } from '~/utils/types/voucher';
import { defaultVoucherRelations, removeDuplicateExpands } from 'wemotoo-common';

type VoucherFilter = {
	query: string;
	page_size: number;
	current_page: number;
};

const initialVoucherFilter: VoucherFilter = {
	query: '',
	page_size: options_page_size[0] as number,
	current_page: 1,
};

const initialEmptyVoucher: Partial<CreateVoucherReq> = {
	code: '',
	name: '',
	description: '',
	status: 'active',
	discount_code: '',
	starts_at: undefined,
	ends_at: undefined,
};

export const useVoucherStore = defineStore('voucherStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		exporting: false as boolean,
		filter: structuredClone(initialVoucherFilter),
		vouchers: [] as Voucher[],
		total_vouchers: 0 as number,
		current_voucher: undefined as Voucher | undefined,
		new_voucher: structuredClone(initialEmptyVoucher),
	}),
	actions: {
		resetNewVoucher() {
			this.new_voucher = structuredClone(initialEmptyVoucher);
		},

		async updatePageSize(size: number) {
			this.filter.page_size = size;

			if (this.filter.page_size > this.vouchers.length) {
				this.filter.current_page = 1;
				return;
			}

			this.getVouchers();
		},

		async updatePage(page: number) {
			this.filter.current_page = page;

			if (this.filter.current_page < 0 || this.vouchers.length === this.total_vouchers) {
				return;
			}

			this.getVouchers();
		},

		async getVouchers() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const queryParams: BaseODataReq = {
					$top: this.filter.page_size,
					$count: true,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$expand: removeDuplicateExpands(defaultVoucherRelations).join(','),
					$orderby: 'updated_at desc',
				};

				if (this.filter.query) {
					queryParams.$search = this.filter.query;
				}

				const response = await $api.voucher.getMany(queryParams);

				if (response.data) {
					this.vouchers = response.data;
					this.total_vouchers = response['@odata.count'] ?? 0;
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process voucher';
				failedNotification(message);
			} finally {
				this.loading = false;
			}
		},

		async getVoucherByCode(code: string): Promise<Voucher | undefined> {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.voucher.getSingle(code);
				if (data.voucher) {
					return data.voucher;
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to process voucher';
				failedNotification(message);
				return undefined;
			} finally {
				this.loading = false;
			}
		},

		async createVoucher(payload: CreateVoucherReq) {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.voucher.create(payload);

				if (data.code) {
					successNotification(`${data.code} - Voucher created`);
					this.vouchers.unshift(data);
				}
				this.resetNewVoucher();
				return data;
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to create voucher';
				failedNotification(message);
				throw err;
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateStatus(voucher: Voucher, status: string) {
			await this.updateVoucher(voucher.code, { status });
		},

		async updateVoucher(code: string, payload: UpdateVoucherReq) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.voucher.update(code, payload);

				if (data.voucher.code) {
					successNotification(`${data.voucher.code} - Voucher updated`);
					this.getVouchers();
				}
				return data;
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to update voucher';
				failedNotification(message);
				throw err;
			} finally {
				this.updating = false;
			}
		},

		async deleteVoucher(code: string) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.voucher.remove({ code });

				if (data.voucher.code) {
					successNotification(`Voucher #${data.voucher.code} deleted`);

					const index = this.vouchers.findIndex((v) => v.code === data.voucher.code);
					if (index !== -1) {
						this.vouchers.splice(index, 1);
					}
				}
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to delete voucher';
				failedNotification(message);
			} finally {
				this.loading = false;
			}
		},
	},
});
