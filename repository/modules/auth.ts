import HttpFactory from '../factory';
import Routes from '../routes.client';

export type LoginReq = {
	email_address: string;
	password: string;
};

class AuthModule extends HttpFactory {
	private readonly RESOURCE = Routes.Auth;

	/**
	 * login with email and password
	 * @param email && @param password
	 * @returns
	 */
	async login(data: LoginReq) {
		return this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Login()}`,
			body: data,
		});
		// const config = useRuntimeConfig();

		// return $fetch(`http://localhost:8888/${this.RESOURCE.Login()}`, {
		// 	method: 'POST',
		// 	body: data,
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'X-API-KEY': config.public.apiKey,
		// 	},
		// });
	}
}

export default AuthModule;
