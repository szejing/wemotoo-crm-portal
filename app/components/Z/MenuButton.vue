<template>
	<UCard
		v-for="(navigate, index) in props.navigations"
		:key="index"
		class="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
		@click="navigateTo(navigate.to)"
	>
		<div class="flex flex-col gap-3">
			<div class="flex items-start justify-between">
				<div class="p-3 rounded-lg" :class="colorClasses.background">
					<UIcon :name="navigate.icon" class="text-2xl" :class="colorClasses.icon" />
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

const colorMap: Record<string, { background: string; icon: string }> = {
	primary: {
		background: 'bg-primary-100 dark:bg-primary-900/30',
		icon: 'text-primary-600 dark:text-primary-400',
	},
	blue: {
		background: 'bg-blue-100 dark:bg-blue-900/30',
		icon: 'text-blue-600 dark:text-blue-400',
	},
	green: {
		background: 'bg-green-100 dark:bg-green-900/30',
		icon: 'text-green-600 dark:text-green-400',
	},
	purple: {
		background: 'bg-purple-100 dark:bg-purple-900/30',
		icon: 'text-purple-600 dark:text-purple-400',
	},
	red: {
		background: 'bg-red-100 dark:bg-red-900/30',
		icon: 'text-red-600 dark:text-red-400',
	},
	yellow: {
		background: 'bg-yellow-100 dark:bg-yellow-900/30',
		icon: 'text-yellow-600 dark:text-yellow-400',
	},
	indigo: {
		background: 'bg-indigo-100 dark:bg-indigo-900/30',
		icon: 'text-indigo-600 dark:text-indigo-400',
	},
	pink: {
		background: 'bg-pink-100 dark:bg-pink-900/30',
		icon: 'text-pink-600 dark:text-pink-400',
	},
	orange: {
		background: 'bg-orange-100 dark:bg-orange-900/30',
		icon: 'text-orange-600 dark:text-orange-400',
	},
};

const colorClasses = computed(() => {
	return colorMap[props.color] ?? colorMap.blue!;
});
</script>

<style scoped></style>
