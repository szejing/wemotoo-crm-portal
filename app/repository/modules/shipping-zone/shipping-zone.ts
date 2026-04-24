import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { CreateShippingZoneReq } from './models/request/create-shipping-zone.req';
import type { UpdateShippingZoneReq } from './models/request/update-shipping-zone.req';
import type { ShippingZoneResp } from './models/response/shipping-zone.resp';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { ShippingZone } from '~/utils/types/shipping-zone';

class ShippingZoneModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.ShippingZones;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<ShippingZone>> {
		return await this.call<BaseODataResp<ShippingZone>>({
			method: 'GET',
			url: this.RESOURCE.Many(),
			query,
		});
	}

	async getSingle(id: string): Promise<ShippingZoneResp> {
		return await this.call<ShippingZoneResp>({
			method: 'GET',
			url: this.RESOURCE.Single(id),
		});
	}

	async create(body: CreateShippingZoneReq): Promise<ShippingZoneResp> {
		return await this.call<ShippingZoneResp>({
			method: 'POST',
			url: this.RESOURCE.Create(),
			body,
		});
	}

	async update(id: string, body: UpdateShippingZoneReq): Promise<ShippingZoneResp> {
		return await this.call<ShippingZoneResp>({
			method: 'PATCH',
			url: this.RESOURCE.Update(id),
			body,
		});
	}

	async remove(id: string): Promise<ShippingZoneResp> {
		return await this.call<ShippingZoneResp>({
			method: 'DELETE',
			url: this.RESOURCE.Delete(id),
		});
	}
}

export default ShippingZoneModule;
