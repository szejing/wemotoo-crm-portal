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
	red: {
		background: 'bg-red-100 dark:bg-red-900/30',
		icon: 'text-red-600 dark:text-red-400',
	},
	orange: {
		background: 'bg-orange-100 dark:bg-orange-900/30',
		icon: 'text-orange-600 dark:text-orange-400',
	},
	amber: {
		background: 'bg-amber-100 dark:bg-amber-900/30',
		icon: 'text-amber-600 dark:text-amber-400',
	},
	yellow: {
		background: 'bg-yellow-100 dark:bg-yellow-900/30',
		icon: 'text-yellow-600 dark:text-yellow-400',
	},
	lime: {
		background: 'bg-lime-100 dark:bg-lime-900/30',
		icon: 'text-lime-600 dark:text-lime-400',
	},
	green: {
		background: 'bg-green-100 dark:bg-green-900/30',
		icon: 'text-green-600 dark:text-green-400',
	},
	emerald: {
		background: 'bg-emerald-100 dark:bg-emerald-900/30',
		icon: 'text-emerald-600 dark:text-emerald-400',
	},
	teal: {
		background: 'bg-teal-100 dark:bg-teal-900/30',
		icon: 'text-teal-600 dark:text-teal-400',
	},
	cyan: {
		background: 'bg-cyan-100 dark:bg-cyan-900/30',
		icon: 'text-cyan-600 dark:text-cyan-400',
	},
	sky: {
		background: 'bg-sky-100 dark:bg-sky-900/30',
		icon: 'text-sky-600 dark:text-sky-400',
	},
	blue: {
		background: 'bg-blue-100 dark:bg-blue-900/30',
		icon: 'text-blue-600 dark:text-blue-400',
	},
	indigo: {
		background: 'bg-indigo-100 dark:bg-indigo-900/30',
		icon: 'text-indigo-600 dark:text-indigo-400',
	},
	violet: {
		background: 'bg-violet-100 dark:bg-violet-900/30',
		icon: 'text-violet-600 dark:text-violet-400',
	},
	purple: {
		background: 'bg-purple-100 dark:bg-purple-900/30',
		icon: 'text-purple-600 dark:text-purple-400',
	},
	fuchsia: {
		background: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
		icon: 'text-fuchsia-600 dark:text-fuchsia-400',
	},
	pink: {
		background: 'bg-pink-100 dark:bg-pink-900/30',
		icon: 'text-pink-600 dark:text-pink-400',
	},
	rose: {
		background: 'bg-rose-100 dark:bg-rose-900/30',
		icon: 'text-rose-600 dark:text-rose-400',
	},
	slate: {
		background: 'bg-slate-100 dark:bg-slate-900/30',
		icon: 'text-slate-600 dark:text-slate-400',
	},
	gray: {
		background: 'bg-gray-100 dark:bg-gray-900/30',
		icon: 'text-gray-600 dark:text-gray-400',
	},
	zinc: {
		background: 'bg-zinc-100 dark:bg-zinc-900/30',
		icon: 'text-zinc-600 dark:text-zinc-400',
	},
	neutral: {
		background: 'bg-neutral-100 dark:bg-neutral-900/30',
		icon: 'text-neutral-600 dark:text-neutral-400',
	},
	stone: {
		background: 'bg-stone-100 dark:bg-stone-900/30',
		icon: 'text-stone-600 dark:text-stone-400',
	},
};

const colorClasses = computed(() => {
	return colorMap[props.color] ?? colorMap.blue!;
});
</script>

<style scoped></style>
