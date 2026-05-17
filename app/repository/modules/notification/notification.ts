import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { NotificationResp } from './models/response/notification.resp';

class NotificationModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Notifications;

	async getMany(): Promise<NotificationResp> {
		return await this.call<NotificationResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}
}

export default NotificationModule;
