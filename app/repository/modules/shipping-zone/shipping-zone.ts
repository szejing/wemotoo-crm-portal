import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';

export type CreateShippingZoneReq = {
	merchant_id: string;
	code: string;
	description?: string | null;
	is_active?: boolean;
	country_code: string;
	state?: string | null;
	postcode_patterns?: { kind: 'exact' | 'prefix' | 'regex'; value: string }[];
	rule?: number;
	is_default?: boolean;
	methods: { shipping_method_id: string; fee: number; estimated_days?: number | null }[];
};

export type UpdateShippingZoneReq = Partial<
	Omit<CreateShippingZoneReq, 'merchant_id' | 'methods'>
> & {
	merchant_id: string;
	methods?: CreateShippingZoneReq['methods'];
};

class ShippingZoneModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.ShippingZones;

	async getMany(): Promise<{ shipping_zones: unknown[]; total: number }> {
		return await this.call<{ shipping_zones: unknown[]; total: number }>({
			method: 'GET',
			url: this.RESOURCE.Many(),
		});
	}

	async getSingle(id: string): Promise<{ shipping_zone: unknown }> {
		return await this.call<{ shipping_zone: unknown }>({
			method: 'GET',
			url: this.RESOURCE.Single(id),
		});
	}

	async create(body: CreateShippingZoneReq): Promise<{ shipping_zone: unknown }> {
		return await this.call<{ shipping_zone: unknown }>({
			method: 'POST',
			url: this.RESOURCE.Create(),
			body,
		});
	}

	async update(id: string, body: UpdateShippingZoneReq): Promise<{ shipping_zone: unknown }> {
		return await this.call<{ shipping_zone: unknown }>({
			method: 'PATCH',
			url: this.RESOURCE.Update(id),
			body,
		});
	}

	async remove(
		id: string,
		body: { merchant_id: string; user: { id: string } },
	): Promise<{ ok: boolean }> {
		return await this.call<{ ok: boolean }>({
			method: 'DELETE',
			url: this.RESOURCE.Delete(id),
			body,
		});
	}
}

export default ShippingZoneModule;
