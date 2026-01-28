import { defineStore } from 'pinia';
import { KEY } from 'wemotoo-common';
import { useMerchantInfoStore } from '~/stores/MerchantInfo/MerchantInfo';
import { useAppStore } from '~/stores/App';
import { useAppUiStore } from '~/stores/AppUi/AppUi';
import type { User } from '~/utils/types/user';
import type { LoginResp } from '~/repository/modules/auth/models/response/login.resp';
import type { VerifyResp } from '~/repository/modules/auth/models/response/verify.resp';

export const useAuthStore = defineStore('authStore', {
	state: () => ({
		loading: false as boolean,
		user: null as User | null,
	}),
	actions: {
		// login
		async login(merchant_id: string, email_address: string, password: string) {
			const { $api } = useNuxtApp();

			this.loading = true;
			const appUiStore = useAppUiStore();

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

				this.user = data.user;

				const merchantInfo = useMerchantInfoStore();
				await merchantInfo.setMerchantInfo(data.merchant_info);

				const app = useAppStore();
				await app.init();

				appUiStore.showToast({
					color: 'success',
					icon: ICONS.CHECK_OUTLINE_ROUNDED,
					title: 'Login Successful',
					description: 'Welcome back!',
				});
			} catch (err: any) {
				this.clearCookies();

				appUiStore.showToast({
					color: 'error',
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

				this.user = data.user;

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

		async validateResetPasswordToken(token: string): Promise<boolean> {
			const { $api } = useNuxtApp();
			const appUiStore = useAppUiStore();

			try {
				const isValid: boolean = await $api.auth.validatePasswordResetToken(token);

				if (!isValid) {
					appUiStore.showToast({
						color: 'error',
						icon: ICONS.ERROR_OUTLINE,
						title: 'Invalid or expired link',
						description: 'The link is invalid or expired.',
					});
				}

				return true;
			} catch (err: any) {
				console.error(err);
				appUiStore.showToast({
					color: 'error',
					icon: ICONS.ERROR_OUTLINE,
					title: 'Failed to validate reset link',
					description: err.message,
				});
				return false;
			}
		},

		async forgotPassword(merchant_id: string, email_address: string): Promise<[boolean, string]> {
			const { $api } = useNuxtApp();
			this.loading = true;
			const appUiStore = useAppUiStore();

			try {
				await $api.auth.passwordReset({ merchant_id, email_address });

				appUiStore.showToast({
					color: 'success',
					icon: ICONS.CHECK_OUTLINE_ROUNDED,
					title: 'Reset link sent',
					description: 'We have successfully sent you a reset link to your email.',
				});
				return [true, ''];
			} catch (err: any) {
				console.error(err);

				appUiStore.showToast({
					color: 'error',
					icon: ICONS.ERROR_OUTLINE,
					title: 'Failed to send reset link',
					description: err.message,
				});

				return [false, err.message];
			} finally {
				this.loading = false;
			}
		},

		async confirmResetPassword(token: string, password: string): Promise<boolean> {
			const { $api } = useNuxtApp();
			this.loading = true;
			const appUiStore = useAppUiStore();

			try {
				await $api.auth.confirmResetPassword({ token, password });

				appUiStore.showToast({
					color: 'success',
					icon: ICONS.CHECK_OUTLINE_ROUNDED,
					title: 'Password reset successful',
					description: 'Your password has been updated. You can now sign in with your new password.',
				});
				return true;
			} catch (err: any) {
				console.error(err);

				appUiStore.showToast({
					color: 'error',
					icon: ICONS.ERROR_OUTLINE,
					title: 'Failed to reset password',
					description: err.message,
				});

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
