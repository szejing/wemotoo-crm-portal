<template>
	<UPageGrid class="lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
		<UCard
			v-for="(stat, index) in stats"
			:key="index"
			:ui="{
				root: 'overflow-hidden',
				body: 'p-4',
			}"
		>
			<NuxtLink
			v-if="stat.to"
			:to="stat.to"
			class="flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-inherit -m-4 p-4"
		>
			<div class="w-10 h-10 flex items-center justify-center rounded-full" :class="stat.iconBg">
				<UIcon :name="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
			</div>
			<div class="min-w-0 flex-1">
				<p class="text-xs font-medium uppercase text-muted">{{ stat.title }}</p>
				<p class="mt-1 text-2xl font-semibold text-highlighted">
					{{ stat.value }}
				</p>
			</div>
		</NuxtLink>
		<div v-else class="flex items-start gap-3 rounded-inherit -m-4 p-4">
			<div class="w-10 h-10 flex items-center justify-center rounded-full" :class="stat.iconBg">
				<UIcon :name="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
			</div>
			<div class="min-w-0 flex-1">
				<p class="text-xs font-medium uppercase text-muted">{{ stat.title }}</p>
				<p class="mt-1 text-2xl font-semibold text-highlighted">
					{{ stat.value }}
				</p>
			</div>
		</div>
		</UCard>
	</UPageGrid>
</template>

<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';

export interface DashboardStatItem {
	title: string;
	value: string | number;
	icon: string;
	iconBg: string;
	iconColor: string;
	to?: string | RouteLocationRaw;
}

defineProps<{
	stats: DashboardStatItem[];
}>();
</script>
