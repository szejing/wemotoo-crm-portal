import { defineStore } from 'pinia';

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
		async login(email_address: string, password: string) {
			const { $api } = useNuxtApp();

			try {
				console.log(email_address);
				console.log(password);

				$api.auth
					.login({ email_address, password })
					.then((data) => {
						console.log(data);
					})
					.catch((error) => {
						console.error(error);
					});

				// const response = await new ApiService().performLogin({
				// 	email: email,
				// 	password: password,
				// });

				// const { $api } = useNuxtApp();

				// const { data: ProductTag, pending, error } = await $api.auth.login(email, password);

				// console.log(response);
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
