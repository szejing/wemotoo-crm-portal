import { defineStore } from 'pinia';
import type { LoginResp } from '~/repository/modules/auth';

export const useAuthStore = defineStore({
	id: 'authStore',
	state: () => ({
		loading: false as boolean,
	}),
	actions: {
		// login
		async login(merchant_id: string, email_address: string, password: string) {
			const { $api } = useNuxtApp();

			this.loading = true;
			try {
				const data: LoginResp = await $api.auth.login({ merchant_id, email_address, password });

				const accessToken = useCookie('accessToken', { maxAge: 60 * 60 * 24 * 7 });
				accessToken.value = data.token;

				const merchantInfo = useMerchantInfoStore();
				merchantInfo.setMerchantInfo(data.merchant_info);
			} catch (err: any) {
				console.log(err);

				const appUiStore = useAppUiStore();
				appUiStore.addNotification({
					color: 'red',
					icon: ICONS.ERROR_OUTLINE,
					title: err.message,
				});
			} finally {
				this.loading = false;
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
			this.loading = true;

			try {
				const response_code: number = await $api.auth.logout();

				return response_code === 200;
			} catch (err: any) {
				console.error(err);
				return true;
			} finally {
				this.loading = false;
			}
		},
	},
});
