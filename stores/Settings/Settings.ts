import { defineStore } from 'pinia';
import { Setting } from '~/utils/types/setting';
import type { SettingSegment } from '~/utils/types/setting-segment';
import { failedNotification, successNotification } from '../AppUi/AppUi';

export const useSettingsStore = defineStore('settingsStore', {
	state: () => ({
		loading: false as boolean,
		segments: [] as SettingSegment[],
		settings: [] as Setting[],
		updatedSettings: [] as Setting[],
	}),
	actions: {
		async getSettings() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.setting.fetchMany();
				if (data.segments) {
					this.segments = data.segments;
				}
				if (data.settings) {
					this.settings = data.settings.map((setting) => new Setting(setting));
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
