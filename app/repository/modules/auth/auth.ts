import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { LoginReq } from './models/request/login.req';
import type { LoginResp } from './models/response/login.resp';
import type { VerifyResp } from './models/response/verify.resp';

export type ForgotPasswordReq = { email: string };
export type ResetPasswordReq = { token: string; password: string };

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

	async forgotPassword(data: ForgotPasswordReq): Promise<void> {
		await this.call<void>({
			method: 'POST',
			url: this.RESOURCE.ForgotPassword(),
			body: data,
		});
	}

	async resetPassword(data: ResetPasswordReq): Promise<void> {
		await this.call<void>({
			method: 'POST',
			url: this.RESOURCE.ResetPassword(),
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
