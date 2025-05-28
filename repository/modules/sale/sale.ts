import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetSalesReq } from './models/request/get-sale.req';
import type { GetSaleResp } from './models/response/get-sale.resp';
import type { GetSalesResp } from './models/response/get-sales.resp';

class SaleModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Sales;

	/**
	 * Fetches all sales
	 * @returns
	 */
	async getTransactions(query: GetSalesReq): Promise<GetSalesResp> {
		return await this.call<GetSalesResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	/**
	 * Fetches sale by bill no
	 * @returns
	 */
	async getTransactionByBillNo(bill_no: string): Promise<GetSaleResp> {
		return await this.call<GetSaleResp>({
			method: 'GET',
			url: `${this.RESOURCE.Single(bill_no)}`,
		});
	}

	/**
	 * Updates order to sale
	 * @returns
	 */
	async updateOrderToSale(order_no: string, customer_no: string): Promise<GetSaleResp> {
		return await this.call<GetSaleResp>({
			method: 'POST',
			url: `${this.RESOURCE.Process()}`,
			body: { order_no, customer_no },
		});
	}
}

export default SaleModule;
