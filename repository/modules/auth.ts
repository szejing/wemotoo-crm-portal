import type { UserRoles } from '~/utils/enum/user-role';
import HttpFactory from '../factory';
import Routes from '../routes.client';

export type LoginReq = {
	merchant_id: string;
	email_address: string;
	password: string;
};

export type LoginResp = {
	role: UserRoles;
	merchant_id: string;
	email_address: string;
	first_name: string;
	last_name: string;
	phone_number: string;
	token: string;
};

class AuthModule extends HttpFactory {
	private readonly RESOURCE = Routes.Auth;

	/**
	 * login with merchant_id, email_address and password
	 * @param merchant_id
	 * @param email_address
	 * @param password
	 * @returns
	 */
	async login(data: LoginReq): Promise<LoginResp> {
		return this.call<LoginResp>({
			method: 'POST',
			url: `${this.RESOURCE.Login()}`,
			body: data,
		});
	}

	/**
	 * refresh session
	 * @returns
	 */
	async refreshToken(): Promise<string> {
		return this.call<string>({
			method: 'POST',
			url: `${this.RESOURCE.Refresh()}`,
		});
	}

	/**
	 * logout
	 * @returns
	 */
	async logout(): Promise<number> {
		return this.call<number>({
			method: 'POST',
			url: `${this.RESOURCE.Logout()}`,
		});
	}
}

export default AuthModule;
