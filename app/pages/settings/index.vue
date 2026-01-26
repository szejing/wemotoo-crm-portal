<template>
	<UDashboardPanel id="settings">
		<template #header>
			<UDashboardNavbar title="Settings" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>

				<template #right>
					<UButton color="success" @click="settingsStore.updateSettings">
						<UIcon :name="ICONS.SAVE" class="w-4 h-4" />
						Save
					</UButton>
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<!-- Header Section -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
					<p class="text-gray-600 dark:text-gray-400">Manage your system configuration and preferences. Changes will take effect immediately.</p>
				</div>

				<!-- Settings Sections -->
				<UTabs :items="tabItems" class="w-full">
					<template v-for="segment in segments" :key="segment.segment_code" #[segment.segment_code]>
						<UCard>
							<ZSettingSegment :segment="segment" />
						</UCard>
					</template>
				</UTabs>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ICONS } from '~/utils/icons';
import type { TabsItem } from '@nuxt/ui';

useHead({ title: 'Wemotoo CRM - Settings' });

const settingsStore = useSettingStore();
const { segments } = storeToRefs(settingsStore);

// Load settings on mount
onMounted(async () => {
	await settingsStore.getSettings();
});

// Transform segments into TabsItem format
const tabItems = computed<TabsItem[]>(() =>
	segments.value.map((segment) => ({
		label: segment.segment_desc,
		icon: ICONS.SETTINGS_ROUNDED,
		slot: segment.segment_code,
	})),
);
</script>

<style scoped></style>
