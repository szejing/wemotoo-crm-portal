import type { Setting } from '~/utils/types/setting';
import type { SettingSegment } from '~/utils/types/setting-segment';

export type SettingsResp = {
	segments: SettingSegment[];
	settings: Setting[];
};
