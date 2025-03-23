import type { Setting } from '~/utils/types/setting';
import type { SettingSegment } from '~/utils/types/setting-segment';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';

type SettingsResp = {
	segments: SettingSegment[];
	settings: Setting[];
};

class SettingModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Settings;

	async fetchMany(): Promise<SettingsResp> {
		return await this.call<SettingsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	// async update(id: number, tag: UpdateTagReq): Promise<UpdateTagResp> {
	// 	return await this.call<any>({
	// 		method: 'PATCH',
	// 		url: `${this.RESOURCE.Update()}`,
	// 		query: { id },
	// 		body: tag,
	// 	});
	// }
}

export default SettingModule;
