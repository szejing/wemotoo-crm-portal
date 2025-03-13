import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { Order } from '~/utils/types/order';

export const useOrderStore = defineStore('orderStore', {
	state: () => ({
		loading: false as boolean,
		orders: [] as Order[],
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {},
});
