import type { BaseODataReq } from '~/repository/base/base.req';
import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetSaleResp } from './models/response/get-sale.resp';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Bill } from './models/response/bill';

class SaleModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Sales;

	/**
	 * Fetches all sales
	 * @returns
	 */
	async getBills(query: BaseODataReq): Promise<BaseODataResp<Bill>> {
		return await this.call<BaseODataResp<Bill>>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	/**
	 * Fetches sale by bill no
	 * @returns
	 */
	async getBillDetailsByBillNo(bill_no: string): Promise<GetSaleResp> {
		return await this.call<GetSaleResp>({
			method: 'GET',
			url: `${this.RESOURCE.Single(bill_no)}`,
		});
	}
}

export default SaleModule;
