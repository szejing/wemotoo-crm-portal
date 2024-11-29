import type { UserRoles } from '~/utils/enum/user-role';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';
import type { MerchantInfo } from '~/utils/types/merchant-info';

export type LoginReq = {
	merchant_id: string;
	email_address: string;
	password: string;
};

export type LoginResp = {
	user: {
		role: UserRoles;
		email_address: string;
		first_name: string;
		last_name: string;
		phone_number: string;
	};
	merchant_info: MerchantInfo[];
	token: string;
	refresh_token: string;
};

export type VerifyResp = {
	user: {
		role: UserRoles;
		email_address: string;
		first_name: string;
		last_name: string;
		phone_number: string;
	};
	merchant_info: MerchantInfo[];
};

class AuthModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Auth;

	/**
	 * login with email_address and password
	 * @param email_address
	 * @param password
	 * @returns
	 */
	async login(data: LoginReq): Promise<LoginResp> {
		return await this.call<LoginResp>({
			method: 'POST',
			url: `${this.RESOURCE.Login()}`,
			body: data,
		});
	}

	/**
	 * refresh session
	 * @returns
	 */
	async verify(): Promise<VerifyResp> {
		return await this.call<VerifyResp>({
			method: 'POST',
			url: `${this.RESOURCE.Verify()}`,
		});
	}

	/**
	 * refresh session
	 * @returns
	 */
	async refreshToken(): Promise<string> {
		return await this.call<string>({
			method: 'POST',
			url: `${this.RESOURCE.Refresh()}`,
		});
	}

	/**
	 * logout
	 * @returns
	 */
	async logout(): Promise<number> {
		return await this.call<number>({
			method: 'POST',
			url: `${this.RESOURCE.Logout()}`,
		});
	}
}

export default AuthModule;
