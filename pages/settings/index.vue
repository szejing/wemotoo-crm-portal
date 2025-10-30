<template>
	<div>
		<UBreadcrumb :links="links" />
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

		<UTabs
			:items="items"
			class="w-full"
			:ui="{
				list: {
					height: 'h-12',
					tab: {
						height: 'h-10',
					},
				},
			}"
		>
			<template #default="{ item }">
				<h3 class="truncate py-4">{{ item.label }}</h3>
			</template>

			<template #item="{ item }">
				<UCard>
					<ZSettingSegment :segment="item.segment" />
				</UCard>
			</template>
		</UTabs>
	</div>
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
