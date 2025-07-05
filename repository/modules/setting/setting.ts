import type { Setting } from '~/utils/types/setting';
import type { SettingSegment } from '~/utils/types/setting-segment';
import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { UpdateSettingReq } from './models/request/update-setting.req';

type SettingsResp = {
	segments: SettingSegment[];
	settings: Setting[];
};

class SettingModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Settings;

	async getMany(): Promise<SettingsResp> {
		return await this.call<SettingsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async saveMany(settings: UpdateSettingReq): Promise<SettingsResp> {
		return await this.call<SettingsResp>({
			method: 'POST',
			url: `${this.RESOURCE.SaveMany()}`,
			body: settings,
		});
	}
}

export default SettingModule;
