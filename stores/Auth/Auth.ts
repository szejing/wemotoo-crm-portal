import { defineStore } from 'pinia';
import type { LoginResp } from '~/repository/modules/auth';

export const useAuthStore = defineStore({
	id: 'authStore',
	state: () => ({
		loading: false as boolean,
		errors: [] as string[],
	}),
	actions: {
		clearErrors() {
			this.errors = [];
		},
		// login
		async login(merchant_id: string, email_address: string, password: string) {
			const { $api } = useNuxtApp();

			try {
				const data: LoginResp = await $api.auth.login({ merchant_id, email_address, password });

				const accessToken = useCookie('accessToken', { maxAge: 60 * 60 * 24 * 7 });
				accessToken.value = data.token;
			} catch (err: any) {
				console.log(err);
				this.errors.push(err.message);
			}
		},
		// refresh session
		async refreshToken() {
			const { $api } = useNuxtApp();

			try {
				const token: string = await $api.auth.refreshToken();

				const accessToken = useCookie('accessToken', { maxAge: 60 * 60 * 24 * 7 });
				accessToken.value = token;
			} catch (err: any) {
				console.error(err);
			}
		},
		// logout
		async logout(): Promise<boolean> {
			const { $api } = useNuxtApp();

			try {
				const response_code: number = await $api.auth.logout();

				return response_code === 200;
			} catch (err: any) {
				console.error(err);
				return true;
			}
		},
	},
});
