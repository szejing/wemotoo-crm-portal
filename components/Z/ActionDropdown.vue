<template>
	<UDropdown :items="items">
		<UButton color="gray" variant="ghost" :icon="ICONS.HORIZONTAL_ELLIPSIS" />

		<template #item="{ item }">
			<UIcon :name="item.icon" class="size-5 text-gray-500" />
			<span class="truncate text-gray-500">{{ item.label }}</span>
		</template>

		<template #danger="{ item }">
			<UIcon :name="item.icon" class="size-5 text-red-600" />
			<span class="truncate text-red-600">{{ item.label }}</span>
		</template>
	</UDropdown>
</template>

<script lang="ts" setup>
defineProps<{ items: any }>();
</script>

<style scoped lang="postcss"></style>
