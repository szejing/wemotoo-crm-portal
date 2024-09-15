import { defineStore } from 'pinia';

import { ApiService } from '~/utils/api';

export const useAuthStore = defineStore({
	id: 'authStore',
	state: () => ({
		loading: false as boolean,
		email: undefined as string | undefined,
		password: undefined as string | undefined,
		errors: [] as string[],
	}),
	actions: {
		// login
		async login(email: string, password: string) {
			try {
				console.log(email);
				console.log(password);

				const response = await new ApiService().performLogin({
					email: email,
					password: password,
				});

				console.log(response);
				// set user
				// this.accessToken = response?.access_token;

				// const userStore = useUserStore();
				// if (response?.user !== undefined && response?.user !== null) {
				// 	userStore.setUser(response?.user);
				// }

				// if (this.accessToken !== undefined && this.accessToken !== null) {
				// 	localStorage.setItem(Constants.ACCESS_TOKEN, this.accessToken);
				// }
			} catch (err: any) {
				console.error(err);
			}
		},
	},
});
