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
			<div class="flex items-start gap-3">
				<div
					class="p-2.5 rounded-full shrink-0"
					:class="stat.iconBg"
				>
					<UIcon :name="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-xs font-medium uppercase text-muted">{{ stat.title }}</p>
					<p class="mt-1 text-2xl font-semibold text-highlighted">
						{{ stat.value }}
					</p>
					<NuxtLink
						v-if="stat.to"
						:to="stat.to"
						class="mt-1 text-xs text-primary hover:underline"
					>
						{{ $t('common.details') }}
					</NuxtLink>
				</div>
			</div>
		</UCard>
	</UPageGrid>
</template>

<script lang="ts" setup>
export interface DashboardStatItem {
	title: string;
	value: string | number;
	icon: string;
	iconBg: string;
	iconColor: string;
	to?: string;
}

defineProps<{
	stats: DashboardStatItem[];
}>();
</script>
