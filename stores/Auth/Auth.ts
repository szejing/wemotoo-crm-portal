import { defineStore } from 'pinia';
import type { LoginResp, VerifyResp } from '~/repository/modules/auth';
import { KEY } from '~/utils/constants/key';

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

			const mid = useCookie(KEY.X_MERCHANT_ID, { maxAge: 60 * 60 * 24 * 7 });
			mid.value = merchant_id;

			try {
				const data: LoginResp = await $api.auth.login({ merchant_id, email_address, password });

				const mid = useCookie(KEY.X_MERCHANT_ID, { maxAge: 60 * 60 * 24 * 7 });
				mid.value = merchant_id;

				const access_token = useCookie(KEY.ACCESS_TOKEN, { maxAge: 60 * 60 * 24 * 7 });
				access_token.value = data.token;

				const refresh_token = useCookie(KEY.REFRESH_TOKEN, { maxAge: 60 * 60 * 24 * 7 });
				refresh_token.value = data.refresh_token;

				const merchantInfo = useMerchantInfoStore();
				await merchantInfo.setMerchantInfo(data.merchant_info);
			} catch (err: any) {
				this.clearCookies();

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
		// async refreshToken() {
		// 	const { $api } = useNuxtApp();

		// 	try {
		// 		const token: string = await $api.auth.refreshToken();

		// 		const access_token = useCookie(KEY.ACCESS_TOKEN, { maxAge: 60 * 60 * 24 * 7 });
		// 		access_token.value = token;
		// 	} catch (err: any) {
		// 		this.clearCookies();
		// 		console.error(err);
		// 	}
		// },
		// logout
		async logout(): Promise<boolean> {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const response_code: number = await $api.auth.logout();

				if (response_code === 200) {
					this.clearCookies();
				}

				return response_code === 200;
			} catch (err: any) {
				console.error(err);
				return true;
			} finally {
				this.loading = false;
			}
		},

		async verify(): Promise<boolean> {
			const { $api } = useNuxtApp();
			this.loading = true;

			try {
				const data: VerifyResp = await $api.auth.verify();

				if (!data.user || !data.merchant_info) {
					this.clearCookies();
				}

				const merchantInfo = useMerchantInfoStore();
				await merchantInfo.setMerchantInfo(data.merchant_info);
				return true;
			} catch (err: any) {
				console.error(err);
				return false;
			} finally {
				this.loading = false;
			}
		},

		clearCookies() {
			const access_token = useCookie(KEY.ACCESS_TOKEN);
			access_token.value = null;

			const merchant_id = useCookie(KEY.X_MERCHANT_ID);
			merchant_id.value = null;
		},
	},
});
