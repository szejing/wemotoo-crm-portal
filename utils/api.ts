import type { LoginRequest } from '~/stores/Auth/model/request/login-request';
import type { LoginResponse } from '~/stores/Auth/model/response/login-response';

export abstract class BaseApiService {
	async call<T>(job: () => Promise<AsyncData<T>>, errorHandler?: (error: any) => Promise<void>) {
		try {
			const response = await job();
			if (response.status.value == 'error') {
				throw new Error(response.error.value);
			}

			return response.data;
		} catch (error: any) {
			console.error(error.data);

			// handle 401 error here
			if (error.status == 401) {
				// fire events to logout user
				// const authStore = useAuthStore();
				// authStore.logout();
			}
			if (errorHandler) {
				await errorHandler(error);
			}
		}
	}
}

export class ApiService extends BaseApiService {
	async performLogin(data: LoginRequest): Promise<LoginResponse | undefined> {
		return super.call<LoginResponse>(
			() =>
				$fetch('/api/auth/login', {
					method: 'POST',
					body: data,
				}),
			(error) => {
				console.error(error);
				throw error;
			},
		);
	}
}

type AsyncData<T> = {
	data: T;
	pending: Ref<boolean>;
	refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>;
	execute: (opts?: AsyncDataExecuteOptions) => Promise<void>;
	clear: () => void;
	error: Ref<any | null>;
	status: Ref<AsyncDataRequestStatus>;
};

interface AsyncDataExecuteOptions {
	dedupe?: 'cancel' | 'defer';
}

type AsyncDataRequestStatus = 'idle' | 'pending' | 'success' | 'error';