import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetDashboardSummReq, GetSummSaleReq, GetSummSaleCustomersReq, GetSummSaleItemsReq } from './models/request';
import type { GetSummSalePaymentsReq } from './models/request/get-summ-sale-payment.req';
import type { GetDashboardSummResp, GetSummSaleCustomersResp, GetSummSalesResp, GetSummSalesItemsResp } from './models/response';
import type { GetSummSalePaymentsResp } from './models/response/get-summ-sale-payment.resp';

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
			url: `${this.RESOURCE.Sales()}`,
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

	/**
	 * Fetches summ sales payments
	 * @returns
	 */
	async getSummSalesPayments(query: GetSummSalePaymentsReq): Promise<GetSummSalePaymentsResp> {
		console.log('query', query);
		return await this.call<GetSummSalePaymentsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Payments()}`,
			query,
		});
	}
}

export default SaleSummaryModule;
