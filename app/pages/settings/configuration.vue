<template>
	<UDashboardPanel id="settings-configuration">
		<template #header>
			<UDashboardNavbar title="Configuration" :ui="{ right: 'gap-3' }">
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
			<div class="p-6 space-y-6">
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Configuration</h2>
					<p class="text-gray-600 dark:text-gray-400">Manage your system configuration and preferences. Changes will take effect after saving.</p>
				</div>

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

useHead({ title: 'Wemotoo CRM - Configuration' });

const settingsStore = useSettingStore();
const { segments } = storeToRefs(settingsStore);

const tabItems = computed<TabsItem[]>(() =>
	segments.value.map((segment) => ({
		label: segment.segment_desc,
		icon: ICONS.SETTINGS_ROUNDED,
		slot: segment.segment_code,
	})),
);

onMounted(async () => {
	await settingsStore.getSettings();
});
</script>

<style scoped></style>
