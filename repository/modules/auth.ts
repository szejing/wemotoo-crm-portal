import HttpFactory from '../factory';
import Routes from '../routes.client';

class AuthModule extends HttpFactory {
	private readonly RESOURCE = Routes.Auth;

	/**
	 * login with email and password
	 * @param email && @param password
	 * @returns
	 */
	async login(email: string, password: string) {
		console.log(email);
		console.log(password);
		return this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Login()}`,
		});
	}
}

export default AuthModule;
