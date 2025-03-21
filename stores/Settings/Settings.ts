import { defineStore } from 'pinia';
import { Setting } from '~/utils/types/setting';
import type { SettingSegment } from '~/utils/types/setting-segment';

export const useSettingsStore = defineStore('settingsStore', {
	state: () => ({
		loading: false as boolean,
		segments: [] as SettingSegment[],
		settings: [] as Setting[],
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
	},
});
