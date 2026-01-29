<template>
	<div class="space-y-4">
		<div class="flex items-center gap-3">
			<UIcon :name="props.icon" class="text-2xl" :class="iconColorClass" />
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

const colorMap: Record<string, string> = {
	primary: 'text-primary-500',
	red: 'text-red-500',
	orange: 'text-orange-500',
	amber: 'text-amber-500',
	yellow: 'text-yellow-500',
	lime: 'text-lime-500',
	green: 'text-green-500',
	emerald: 'text-emerald-500',
	teal: 'text-teal-500',
	cyan: 'text-cyan-500',
	sky: 'text-sky-500',
	blue: 'text-blue-500',
	indigo: 'text-indigo-500',
	violet: 'text-violet-500',
	purple: 'text-purple-500',
	fuchsia: 'text-fuchsia-500',
	pink: 'text-pink-500',
	rose: 'text-rose-500',
	slate: 'text-slate-500',
	gray: 'text-gray-500',
	zinc: 'text-zinc-500',
	neutral: 'text-neutral-500',
	stone: 'text-stone-500',
};

const iconColorClass = computed(() => {
	return colorMap[props.color] ?? colorMap.blue!;
});
</script>

<style scoped></style>
