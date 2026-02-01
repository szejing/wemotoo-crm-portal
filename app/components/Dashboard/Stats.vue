<!-- eslint-disable indent -->
<template>
	<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
		<UPageCard
			v-for="(stat, index) in baseStats"
			:key="index"
			:icon="stat.icon"
			:title="stat.title"
			:to="stat.to"
			variant="subtle"
			:ui="{
				container: 'gap-y-1.5',
				wrapper: 'items-start',
				leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
				title: 'font-normal text-muted text-xs uppercase',
			}"
			class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
		>
			<div class="flex items-center gap-2">
				<span class="text-2xl font-semibold text-highlighted">
					{{ stat.value }}
				</span>
			</div>
		</UPageCard>
	</UPageGrid>
</template>

<script setup lang="ts">
import { formatCurrency } from 'wemotoo-common';

const summOrderStore = useSummOrderStore();
const { new_appointments, new_orders, pending_payments, pending_actions } = storeToRefs(summOrderStore);

const baseStats = computed(() => [
	{
		title: 'Appointments',
		icon: 'i-heroicons-calendar-days',
		value: new_appointments.value ?? 0,
		to: '/appointments',
	},
	{
		title: 'Orders',
		icon: 'i-heroicons-shopping-cart',
		value: new_orders.value ?? 0,
		to: '/orders',
	},
	{
		title: 'Pending Payments',
		icon: 'i-heroicons-credit-card',
		value: pending_payments.value ?? 0,
	},
	{
		title: 'Pending Actions',
		icon: 'i-heroicons-bell',
		formatter: formatCurrency,
		value: pending_actions.value ?? 0,
		to: '/analytics',
	},
]);
</script>
