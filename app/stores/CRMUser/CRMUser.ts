import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { CRMUser } from '~/utils/types/crm-user';
import { failedNotification } from '../AppUi/AppUi';
import type { BaseODataReq } from '~/repository/base/base.req';

type CrmUserFilter = {
	query: string;
	page_size: number;
	current_page: number;
};

const initialFilter: CrmUserFilter = {
	query: '',
	page_size: options_page_size[0] as number,
	current_page: 1,
};

export const useCRMUserStore = defineStore('crmUserStore', {
	state: () => ({
		loading: false as boolean,
		crm_users: [] as CRMUser[],
		total_count: 0 as number,
		errors: [] as string[],
		filter: initialFilter,
	}),
	actions: {
		async updatePageSize(size: number) {
			this.filter.page_size = size;
			if (this.filter.page_size > this.crm_users.length) {
				this.filter.current_page = 1;
				return;
			}
			await this.getCrmUsers();
		},

		async updatePage(page: number) {
			this.filter.current_page = page;
			if (this.filter.current_page < 1 || this.crm_users.length === this.total_count) {
				return;
			}
			await this.getCrmUsers();
		},

		async getCrmUsers() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const queryParams: BaseODataReq = {
					$top: this.filter.page_size,
					$count: true,
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$orderby: 'created_at desc',
				};
				if (this.filter.query?.trim()) {
					queryParams.$search = this.filter.query.trim();
				}

				const resp = await $api.crmUser.getMany(queryParams);
				const data = (resp as { data?: CRMUser[] }).data ?? (resp as { value?: CRMUser[] }).value ?? [];
				const total = (resp as { '@odata.count'?: number })['@odata.count'] ?? 0;

				if (this.filter.current_page > 1 && this.total_count > this.crm_users.length) {
					this.crm_users = [...this.crm_users, ...data];
				} else {
					this.crm_users = data;
				}
				this.total_count = total;
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to load CRM users';
				console.error(err);
				failedNotification(message);
			} finally {
				this.loading = false;
			}
		},

		async getCrmUser(id: string) {
			const { $api } = useNuxtApp();
			try {
				const resp = await $api.crmUser.getSingle(id);

				return resp;
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to load CRM user';
				console.error(err);
				failedNotification(message);
				return null;
			}
		},

		async updateCrmUser(id: string, body: Record<string, unknown>) {
			const { $api } = useNuxtApp();
			try {
				const resp = await $api.crmUser.update(id, body);
				if (resp?.user) {
					return resp.user;
				}
				return null;
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to update CRM user';
				console.error(err);
				failedNotification(message);
				return null;
			}
		},

		async updateCrmUserPassword(id: string, body: Record<string, unknown>) {
			const { $api } = useNuxtApp();
			try {
				const resp = await $api.crmUser.updatePassword(id, body);
				if (resp?.user) {
					return resp.user;
				}
				return null;
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : 'Failed to update CRM user password';
				console.error(err);
				failedNotification(message);
				return null;
			}
		},
	},
});
