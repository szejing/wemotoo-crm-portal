import { defineStore } from 'pinia';
import { Setting } from '~/utils/types/setting';
import type { SettingSegment } from '~/utils/types/setting-segment';
import { failedNotification, successNotification } from '../AppUi/AppUi';

export const useSettingStore = defineStore('settingStore', {
	state: () => ({
		loading: false as boolean,
		segments: [] as SettingSegment[],
		settings: [] as Setting[],
		updatedSettings: [] as Setting[],
		page_size: 10,
		current_page: 1,
		total_settings: 0,
	}),
	actions: {
		async getSettings() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const { data } = await $api.setting.getMany({
					$top: this.page_size,
					$count: true,
					$expand: 'setting_templs,segment_children.setting_templs',
					$skip: (this.current_page - 1) * this.page_size,
				});

				if (data) {
					this.segments = data[0]?.segments ?? [];
					this.settings = data[0]?.settings.map((setting) => new Setting(setting)) ?? [];
					// this.total_settings = data[0]['@odata.count'] ?? 0;
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.loading = false;
			}
		},

		getSetting(groupCode: string, setCode: string): Setting | null {
			return this.settings.find((setting) => setting.group_code === groupCode && setting.set_code === setCode) ?? null;
		},

		addToUpdatedSettings(setting: Setting) {
			const existingSetting = this.updatedSettings.find((s) => s.set_code === setting.set_code);
			if (existingSetting) {
				existingSetting.set_value = setting.set_value;
			} else {
				this.updatedSettings.push(setting);
			}
		},

		async updateSettings() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.setting.saveMany({
					settings: this.updatedSettings.map((setting) => ({
						group_code: setting.group_code,
						set_code: setting.set_code,
						set_value: setting.set_value,
					})),
				});

				if (data.segments) {
					this.segments = data.segments;
				}
				if (data.settings) {
					successNotification(`Settings Updated !`);
					this.settings = data.settings.map((setting) => new Setting(setting));
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},
	},
});
