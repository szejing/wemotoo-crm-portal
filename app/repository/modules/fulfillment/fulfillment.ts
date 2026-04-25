import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { FulfillmentActionReq } from './models/request/fulfillment-action.req';
import type { FulfillmentResp } from './models/response/fulfillment.resp';

class FulfillmentModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Fulfillment;

	async create(order_no: string, body: FulfillmentActionReq): Promise<FulfillmentResp> {
		return await this.call<FulfillmentResp>({
			method: 'POST',
			url: this.RESOURCE.Create(encodeURIComponent(order_no)),
			body,
		});
	}

	async markProcessing(order_no: string, body: FulfillmentActionReq): Promise<FulfillmentResp> {
		return await this.call<FulfillmentResp>({
			method: 'PATCH',
			url: this.RESOURCE.MarkProcessing(encodeURIComponent(order_no)),
			body,
		});
	}

	async markPacked(order_no: string, body: FulfillmentActionReq): Promise<FulfillmentResp> {
		return await this.call<FulfillmentResp>({
			method: 'PATCH',
			url: this.RESOURCE.MarkPacked(encodeURIComponent(order_no)),
			body,
		});
	}

	async markFulfilled(order_no: string, body: FulfillmentActionReq): Promise<FulfillmentResp> {
		return await this.call<FulfillmentResp>({
			method: 'PATCH',
			url: this.RESOURCE.MarkFulfilled(encodeURIComponent(order_no)),
			body,
		});
	}
}

export default FulfillmentModule;
