import { defineStore } from 'pinia';
import type { Setting } from '~/utils/types/setting';
import type { SettingSegment } from '~/utils/types/setting-segment';

export const useSettingsStore = defineStore({
	id: 'settingsStore',
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
					this.settings = data.settings;
				}

				console.log(this.segments);
				console.log(this.settings);
			} catch (error) {
				console.error(error);
			} finally {
				this.loading = false;
			}
		},
	},
});
