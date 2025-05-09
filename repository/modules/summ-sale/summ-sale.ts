import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetDashboardSummReq, GetSummSaleReq, GetSummSaleCustomersReq, GetSummSaleItemsReq } from './models/request';
import type { GetDashboardSummResp, GetSummSaleCustomersResp, GetSummSalesResp, GetSummSalesItemsResp } from './models/response';

class SaleSummaryModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.SummSales;

	/**
	 * Fetches dashboard order summary
	 * @returns
	 */
	async getDashboardSalesSummary(query: GetDashboardSummReq): Promise<GetDashboardSummResp> {
		return await this.call<GetDashboardSummResp>({
			method: 'GET',
			url: `${this.RESOURCE.Dashboard()}`,
			query,
		});
	}

	/**
	 * Fetches summ sales
	 * @returns
	 */
	async getSummSales(query: GetSummSaleReq): Promise<GetSummSalesResp> {
		return await this.call<GetSummSalesResp>({
			method: 'GET',
			url: `${this.RESOURCE.Orders()}`,
			query,
		});
	}

	/**
	 * Fetches summ sales items
	 * @returns
	 */
	async getSummSalesItems(query: GetSummSaleItemsReq): Promise<GetSummSalesItemsResp> {
		return await this.call<GetSummSalesItemsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Items()}`,
			query,
		});
	}

	/**
	 * Fetches summ sales customers
	 * @returns
	 */
	async getSummSalesCustomers(query: GetSummSaleCustomersReq): Promise<GetSummSaleCustomersResp> {
		return await this.call<GetSummSaleCustomersResp>({
			method: 'GET',
			url: `${this.RESOURCE.Customers()}`,
			query,
		});
	}
}

export default SaleSummaryModule;
