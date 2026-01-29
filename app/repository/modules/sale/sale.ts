import type { BaseODataReq } from '~/repository/base/base.req';
import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetSaleResp } from './models/response/get-sale.resp';
import type { GetSalesResp } from './models/response/get-sales.resp';

class SaleModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Sales;

	/**
	 * Fetches all sales
	 * @returns
	 */
	async getBills(query: BaseODataReq): Promise<GetSalesResp> {
		return await this.call<GetSalesResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	/**
	 * Exports bills as CSV
	 * @returns
	 */
	async exportBills(query: BaseODataReq): Promise<Blob> {
		return await this.call<Blob>({
			method: 'POST',
			url: `${this.RESOURCE.Export()}`,
			query,
			fetchOptions: {
				responseType: 'blob', // Tell the HTTP client to expect a blob response
			},
		});
	}

	/**
	 * Fetches sale by bill no
	 * @returns
	 */
	async getBillDetailsByBillNo(bill_no: string): Promise<GetSaleResp> {
		return await this.call<GetSaleResp>({
			method: 'GET',
			url: `${this.RESOURCE.Single(encodeURIComponent(bill_no))}`,
		});
	}
}

export default SaleModule;
