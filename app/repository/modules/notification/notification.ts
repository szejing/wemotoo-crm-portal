import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type {
	NotificationItemResp,
	NotificationResp,
} from './models/response/notification.resp';

class NotificationModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Notifications;

	async getMany(query: BaseODataReq = {}): Promise<NotificationResp> {
		return await this.call<NotificationResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	async read(id: string): Promise<NotificationItemResp> {
		return await this.call<NotificationItemResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Read(id)}`,
		});
	}

	async open(id: string): Promise<NotificationItemResp> {
		return await this.call<NotificationItemResp>({
			method: 'PATCH',
			url: `${this.RESOURCE.Open(id)}`,
		});
	}
}

export default NotificationModule;
