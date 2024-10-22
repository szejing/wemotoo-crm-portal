import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { Customer } from '~/utils/types/customer';

// const initial: Customer[] = [
// 	{
// 		customer_no: '1',
// 		name: 'John JohnJohnJohn',
// 		email_address: 'johnDoe@gmail.com',
// 		phone_number: '1234567890',
// 	},
// 	{
// 		customer_no: '2',
// 		name: 'Jane Jane',
// 		email_address: 'janeDoe@gmail.com',
// 		phone_number: '72616287',
// 	},
// 	{
// 		customer_no: '3',
// 		name: 'Lee Lee',
// 		email_address: 'leeDoe@gmail.com',
// 		phone_number: '623423',
// 	},
// 	{
// 		customer_no: '4',
// 		name: 'John Wick',
// 		email_address: 'johnWIck@gmail.com',
// 		phone_number: '623423',
// 	},
// 	{
// 		customer_no: '5',
// 		name: 'John cena',
// 		email_address: 'johncena@gmail.com',
// 		phone_number: '623423',
// 	},
// ];
export const useCustomersStore = defineStore({
	id: 'customersStore',
	state: () => ({
		loading: false as boolean,
		customers: [] as Customer[],
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		updatePageSize(size: number) {
			this.pageSize = size;
		},
		async getCustomers() {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			// this.customers = structuredClone(initial);
			this.loading = false;
		},
		async addCustomer(customer: Customer) {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			this.customers.push(customer);
			this.loading = false;
		},
		async updateCustomer(customer: Customer) {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const index = this.customers.findIndex((c) => c.customer_no === customer.customer_no);
			if (index > -1) {
				this.customers[index] = customer;
			}
			this.loading = false;
		},
		async deleteCustomer(customer_no: string) {
			this.loading = true;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			this.customers = this.customers.filter((c) => c.customer_no !== customer_no);
			this.loading = false;
		},
	},
});
