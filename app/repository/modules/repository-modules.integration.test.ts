import { beforeEach, describe, expect, it } from 'bun:test';
import MerchantRoutes from '~/repository/routes.client';
import { ApiErrorModel } from '~/utils/types/api-error-model';
import { loginPayload } from '../../../test/repository-model-fixtures';
import { fetchLog, lastFetch, resetFetchMock, type FetchCall } from '../../../test/repository-test-setup';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { CRMUser } from '~/utils/types/crm-user';
import * as RepositoryModules from './index';
import AuthModule from './auth/auth';
import CrmUserModule from './crm-user/crm-user';

const odata: BaseODataReq = { $top: 5 };

/** Like `resetFetchMock` but controls the resolved / thrown value (still records `fetchLog`). */
function setMockFetch(
	impl: (request: string, options?: Record<string, unknown>) => Promise<unknown>,
): void {
	fetchLog.length = 0;
	(globalThis as unknown as { $fetch: typeof $fetch }).$fetch = (async (
		url: string,
		opts?: Record<string, unknown>,
	) => {
		const entry: FetchCall = { url, opts: opts ?? {} };
		fetchLog.push(entry);
		return impl(url, opts);
	}) as typeof $fetch;
}

beforeEach(() => {
	resetFetchMock();
});

describe('repository modules + HttpFactory ($fetch)', () => {
	it('returns the JSON body from $fetch (module → call → $fetch)', async () => {
		const user = { id: '1' } as CRMUser;
		const payload = {
			data: [user],
			count: 1,
			value: [user],
			'@odata.count': 1,
		} satisfies BaseODataResp<CRMUser>;
		setMockFetch(async () => payload);

		const mod = new CrmUserModule();
		const result = await mod.getMany(odata);

		expect(result).toBe(payload);
		expect(lastFetch().url).toBe(MerchantRoutes.CrmUsers.Many());
		expect(lastFetch().opts.query).toEqual(odata);
	});

	it('propagates structured API errors from $fetch (same shape as HttpFactory)', async () => {
		const apiErr = { message: 'Not found', response_code: 404 };
		setMockFetch(async () => {
			throw { data: { data: { error: apiErr } } };
		});

		const mod = new CrmUserModule();
		await expect(mod.getSingle('missing')).rejects.toEqual(apiErr);
		expect(lastFetch().url).toBe(MerchantRoutes.CrmUsers.Single('missing'));
	});

	it('wraps non-API failures in ApiErrorModel', async () => {
		setMockFetch(async () => {
			throw new Error('network');
		});

		const mod = new CrmUserModule();
		const err = await mod.getMany(odata).catch((e: unknown) => e);
		expect(err).toBeInstanceOf(ApiErrorModel);
		expect((err as ApiErrorModel).message).toBe('Internal Server Error');
	});
});

describe('multi-step repository flows (call order)', () => {
	it('records sequential auth then CRM requests in fetch order', async () => {
		const auth = new AuthModule();
		const crm = new CrmUserModule();

		await auth.login(loginPayload);
		await auth.verify();
		await crm.getMany(odata);

		expect(fetchLog).toHaveLength(3);
		expect(fetchLog[0]!.url).toBe(MerchantRoutes.Auth.Login());
		expect(fetchLog[1]!.url).toBe(MerchantRoutes.Auth.Verify());
		expect(fetchLog[2]!.url).toBe(MerchantRoutes.CrmUsers.Many());
	});
});

describe('barrel export (./index)', () => {
	it('every exported constructor produces an HttpFactory instance with call()', () => {
		for (const key of Object.keys(RepositoryModules)) {
			const exported = (RepositoryModules as Record<string, unknown>)[key];
			if (typeof exported !== 'function') {
				continue;
			}
			const inst = new (exported as new () => { call: (...args: unknown[]) => unknown })();
			expect(typeof inst.call).toBe('function');
		}
	});
});
