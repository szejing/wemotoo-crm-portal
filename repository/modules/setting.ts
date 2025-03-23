import type { Setting } from '~/utils/types/setting';
import type { SettingSegment } from '~/utils/types/setting-segment';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';

type SettingsResp = {
	segments: SettingSegment[];
	settings: Setting[];
};

type SettingReq = {
	group_code: string;
	set_code: string;
	set_value: string;
};

type UpdateSettingReq = {
	settings: SettingReq[];
};

class SettingModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Settings;

	async fetchMany(): Promise<SettingsResp> {
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
