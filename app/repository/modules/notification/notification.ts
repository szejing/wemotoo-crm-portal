import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type {
	NotificationItemResp,
	NotificationResp,
} from './models/response/notification.resp';

class NotificationModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.Notifications;

	async getMany(options: { includeRead?: boolean } = {}): Promise<NotificationResp> {
		return await this.call<NotificationResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query: options.includeRead ? { include_read: true } : undefined,
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
