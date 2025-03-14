<template>
	<div>
		<UBreadcrumb :links="links" />
		<h1>Settings</h1>

		<UTabs :items="items" class="w-full">
			<template #item="{ item }">
				<UCard>
					<template #header>
						<h2 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
							{{ item.label }}
						</h2>
					</template>

					<div v-for="child in item.children" :key="child.key" class="space-y-3">
						<h2>{{ child.segment_desc }}</h2>

						<div v-for="template in child.setting_templs" :key="template.set_code">
							<h3>{{ template.set_desc }}</h3>
						</div>
					</div>

					<div v-for="child in item.children" :key="child.key" class="space-y-3">
						<h2>{{ child.set_desc }}</h2>
					</div>
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
	children: segment.segment_children.length > 0 ? segment.segment_children : segment.setting_templs,
}));
</script>

<style scoped lang="css"></style>
