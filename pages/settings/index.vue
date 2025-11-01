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
			<div class="flex justify-between items-center my-4">
				<div>
					<h1>Settings</h1>
					<p class="text-base text-neutral-400">
						These settings are used to configure the system. <br />
						Please note that changes will take effect immediately.
					</p>
				</div>
				<div class="w-[20%]">
					<UButton size="md" color="success" variant="solid" block @click="settingsStore.updateSettings">Save</UButton>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Settings',
		icon: ICONS.SETTINGS_ROUNDED,
		to: '/settings',
	},
];

const settingsStore = useSettingStore();

useHead({ title: 'Wemotoo CRM - Settings' });

onMounted(async () => {
	await settingsStore.getSettings();
});

const { segments } = storeToRefs(settingsStore);

const items = segments.value.map((segment) => ({
	key: segment.segment_code,
	label: segment.segment_desc,
	description: segment.segment_desc,
	segment: segment,
}));
</script>

<style scoped></style>
