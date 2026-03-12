<template>
	<UCard>
		<div class="space-y-4">
			<div class="flex items-start justify-between">
				<div class="space-y-1">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">{{ description }}</p>
				</div>
				<div class="shrink-0 rounded-full size-10 flex items-center justify-center" :class="iconBgClass">
					<UIcon :name="icon" class="size-6 text-white" />
				</div>
			</div>

			<USeparator />

			<div class="-mx-1">
				<NuxtLink
					v-for="(item, index) in items"
					:key="index"
					:to="item.to"
					class="flex items-center justify-between px-1 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
				>
					<span>{{ item.label }}</span>
					<UIcon :name="ICONS.CHEVRON_RIGHT" class="text-lg text-gray-400 dark:text-gray-500" />
				</NuxtLink>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import { ICONS } from '~/utils/icons';

const props = defineProps<{
	title: string;
	description: string;
	icon: string;
	color: 'green' | 'blue' | 'pink' | 'purple' | 'teal' | 'orange' | 'red' | 'slate';
	items: { label: string; to: string }[];
}>();

const colorBgMap: Record<string, string> = {
	green: 'bg-green-400',
	blue: 'bg-blue-400',
	pink: 'bg-pink-400',
	purple: 'bg-purple-400',
	teal: 'bg-teal-400',
	orange: 'bg-orange-400',
	red: 'bg-red-400',
	slate: 'bg-slate-400',
};

const iconBgClass = computed(() => colorBgMap[props.color] ?? colorBgMap.blue);
</script>
