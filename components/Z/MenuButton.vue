<template>
	<UCard
		v-for="(navigate, index) in props.navigations"
		:key="index"
		class="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
		@click="navigateTo(navigate.to)"
	>
		<div class="flex flex-col gap-3">
			<div class="flex items-start justify-between">
				<div class="p-3 rounded-lg" :class="`bg-${color}-100 dark:bg-${color}-900/30`">
					<UIcon :name="navigate.icon" class="text-2xl" :class="`text-${color}-600 dark:text-${color}-400`" />
				</div>
				<UIcon name="i-heroicons-arrow-right" class="text-gray-400 dark:text-gray-500" />
			</div>
			<div>
				<h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ navigate.title }}</h4>
				<p class="text-sm text-gray-600 dark:text-gray-400">{{ navigate.description }}</p>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
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
