<template>
	<UDashboardPanel id="settings-configuration">
		<template #header>
			<UDashboardNavbar :title="$t('nav.configuration')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>

				<template #right>
					<UButton color="success" @click="settingsStore.updateSettings">
						<UIcon :name="ICONS.SAVE" class="w-4 h-4" />
						{{ $t('common.save') }}
					</UButton>
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="p-6 space-y-6">
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('nav.configuration') }}</h2>
					<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.configurationPageDesc') }}</p>
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

const { t } = useI18n();
useHead({ title: () => t('pages.configurationTitle') });

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
