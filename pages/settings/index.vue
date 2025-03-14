<template>
	<div>
		<UBreadcrumb :links="links" />
		<h1>Settings</h1>

		<UTabs :items="items" class="w-full">
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

const settingsStore = useSettingsStore();

const { segments } = storeToRefs(settingsStore);

const items = segments.value.map((segment) => ({
	key: segment.segment_code,
	label: segment.segment_desc,
	description: segment.segment_desc,
	segment: segment,
}));
</script>

<style scoped lang="postcss"></style>
