<template>
	<div class="space-y-4">
		<div class="flex items-center gap-3">
			<UIcon :name="props.icon" class="text-2xl" :class="`text-${props.color}-500`" />
			<div>
				<h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ props.title }}</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400">{{ props.description }}</p>
			</div>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<ZMenuButton :color="props.color" :navigations="props.navigations" />
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	title: string;
	icon: string;
	description: string;
	color: string;
	navigations: {
		title: string;
		icon: string;
		to: string;
		description: string;
	}[];
}>();
</script>

<style scoped></style>
