import type { SummSaleBill, SummSaleCustomer, SummSaleItem, SummSalePayment } from '~/utils/types/summ-sales';
import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { GetDashboardSummReq } from './models/request';
import type { GetDashboardSummResp } from './models/response';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';

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
	async getSummSales(query: BaseODataReq): Promise<BaseODataResp<SummSaleBill>> {
		return await this.call<BaseODataResp<SummSaleBill>>({
			method: 'GET',
			url: `${this.RESOURCE.Sales()}`,
			query,
		});
	}

	/**
	 * Fetches summ sales items
	 * @returns
	 */
	async getSummSalesItems(query: BaseODataReq): Promise<BaseODataResp<SummSaleItem>> {
		return await this.call<BaseODataResp<SummSaleItem>>({
			method: 'GET',
			url: `${this.RESOURCE.Items()}`,
			query,
		});
	}

	/**
	 * Fetches summ sales customers
	 * @returns
	 */
	async getSummSalesCustomers(query: BaseODataReq): Promise<BaseODataResp<SummSaleCustomer>> {
		return await this.call<BaseODataResp<SummSaleCustomer>>({
			method: 'GET',
			url: `${this.RESOURCE.Customers()}`,
			query,
		});
	}

	/**
	 * Fetches summ sales payments
	 * @returns
	 */
	async getSummSalesPayments(query: BaseODataReq): Promise<BaseODataResp<SummSalePayment>> {
		return await this.call<BaseODataResp<SummSalePayment>>({
			method: 'GET',
			url: `${this.RESOURCE.Payments()}`,
			query,
		});
	}
}

export default SaleSummaryModule;
