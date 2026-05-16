import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Courier } from '~/utils/types/courier';
import type { CreateCourierReq } from './models/request/create-courier.req';
import type { UpdateCourierReq } from './models/request/update-courier.req';
import type { CourierResp } from './models/response/courier.resp';

class CourierModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Couriers;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<Courier>> {
		return await this.call<BaseODataResp<Courier>>({
			method: 'GET',
			url: this.RESOURCE.Many(),
			query,
		});
	}

	async getSingle(id: number | string): Promise<CourierResp> {
		return await this.call<CourierResp>({
			method: 'GET',
			url: this.RESOURCE.Single(id),
		});
	}

	async create(body: CreateCourierReq): Promise<CourierResp> {
		return await this.call<CourierResp>({
			method: 'POST',
			url: this.RESOURCE.Create(),
			body,
		});
	}

	async update(id: number | string, body: UpdateCourierReq): Promise<CourierResp> {
		return await this.call<CourierResp>({
			method: 'PATCH',
			url: this.RESOURCE.Update(id),
			body,
		});
	}

	async remove(id: number | string): Promise<CourierResp> {
		return await this.call<CourierResp>({
			method: 'DELETE',
			url: this.RESOURCE.Delete(id),
		});
	}
}

export default CourierModule;
