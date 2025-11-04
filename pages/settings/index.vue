<template>
	<UDashboardPanel id="settings">
		<template #header>
			<UDashboardNavbar title="Settings" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="p-6 space-y-8">
				<!-- Header Section -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
					<p class="text-gray-600 dark:text-gray-400">Manage your system configuration and preferences. Changes will take effect immediately.</p>
				</div>

				<!-- Settings Sections -->
				<div v-if="items.length > 0" class="space-y-6">
					<div v-for="item in items" :key="item.key" class="space-y-4">
						<!-- Section Header -->
						<div class="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
							<UIcon :name="ICONS.SETTINGS_ROUNDED" class="text-xl text-primary-500" />
							<div>
								<h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ item.label }}</h3>
								<p class="text-sm text-gray-600 dark:text-gray-400">{{ item.description }}</p>
							</div>
						</div>

						<!-- Settings Card -->
						<UCard class="border border-gray-200 dark:border-gray-700">
							<div class="space-y-4">
								<!-- Settings content based on segment -->
								<div class="grid gap-4">
									<div class="text-sm text-gray-600 dark:text-gray-400">
										{{ item.segment.segment_desc }}
									</div>
									<!-- Add your segment-specific form fields here -->
								</div>
							</div>
						</UCard>
					</div>
				</div>

				<!-- Empty State -->
				<UCard v-else class="border border-gray-200 dark:border-gray-700">
					<div class="flex flex-col items-center justify-center py-12 text-center">
						<UIcon :name="ICONS.SETTINGS_ROUNDED" class="text-5xl text-gray-400 dark:text-gray-600 mb-4" />
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No settings available</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">Settings configuration is being loaded or not yet configured.</p>
					</div>
				</UCard>

				<!-- Save Button Section (Sticky at bottom) -->
				<div class="sticky bottom-6 z-10 flex justify-end">
					<UButton size="lg" color="primary" variant="solid" icon="i-heroicons-check" class="shadow-lg" @click="settingsStore.updateSettings">
						Save Changes
					</UButton>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
useHead({ title: 'Wemotoo CRM - Settings' });

const settingsStore = useSettingStore();
const { segments } = storeToRefs(settingsStore);

// Load settings on mount
onMounted(async () => {
	await settingsStore.getSettings();
});

// Transform segments into settings items
const items = computed(() =>
	segments.value.map((segment) => ({
		key: segment.segment_code,
		label: segment.segment_desc,
		description: segment.segment_desc,
		segment: segment,
	})),
);
</script>

<style scoped></style>
