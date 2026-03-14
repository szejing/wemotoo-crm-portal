<!-- eslint-disable indent -->
<template>
	<div class="relative">
		<div class="absolute top-0 right-0 z-1">
			<UPopover v-model:open="customizeOpen" :content="{ align: 'end' }">
				<UButton icon="i-heroicons-cog-6-tooth" color="neutral" variant="ghost" size="xs" :aria-label="$t('pages.dashboardStatsCustomize')" />
				<template #content>
					<div class="p-3 min-w-56">
						<p class="text-xs font-medium text-muted uppercase mb-2">
							{{ $t('pages.dashboardStatsCustomize') }}
						</p>
						<div class="space-y-1.5">
							<label v-for="key in ALL_DASHBOARD_STAT_KEYS" :key="key" class="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-elevated cursor-pointer">
								<UCheckbox :model-value="isSelected(key)" @update:model-value="toggleStat(key)" />
								<span class="text-sm">{{ statLabel(key) }}</span>
							</label>
						</div>
						<UButton
							class="mt-3 w-full"
							color="neutral"
							variant="soft"
							size="xs"
							:label="$t('pages.dashboardStatsReset')"
							@click="
								resetToDefault();
								customizeOpen = false;
							"
						/>
					</div>
				</template>
			</UPopover>
		</div>
		<UPageGrid class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<UPageCard
				v-for="stat in visibleStats"
				:key="stat.key"
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
						{{ stat.formattedValue }}
					</span>
				</div>
			</UPageCard>
		</UPageGrid>
	</div>
</template>

<script setup lang="ts">
import { formatCurrency } from 'wemotoo-common';
import { useDashboardStatsConfig, ALL_DASHBOARD_STAT_KEYS, type DashboardStatKey } from '~/composables/useDashboardStatsConfig';

const summOrderStore = useSummOrderStore();
const { new_appointments, new_orders, pending_payments, pending_actions, total_order_amt, new_customers } = storeToRefs(summOrderStore);

const { t } = useI18n();
const { selectedKeys, toggleStat, isSelected, resetToDefault } = useDashboardStatsConfig();

const customizeOpen = ref(false);

function statLabel(key: DashboardStatKey): string {
	const labels: Record<DashboardStatKey, string> = {
		appointment_orders: t('pages.dashboardStatsAppointmentOrders'),
		item_orders: t('pages.dashboardStatsItemOrders'),
		pending_payments: t('pages.dashboardStatsPendingPayments'),
		pending_actions: t('pages.dashboardStatsPendingActions'),
		revenue: t('pages.dashboardStatsRevenue'),
		new_customers: t('pages.dashboardStatsNewCustomers'),
	};
	return labels[key];
}

const statDefs: Record<
	DashboardStatKey,
	{
		icon: string;
		to?: string;
		formatter?: (v: number) => string;
	}
> = {
	appointment_orders: {
		icon: 'i-heroicons-calendar-days',
		to: '/appointments',
	},
	item_orders: {
		icon: 'i-heroicons-shopping-cart',
		to: '/sales/orders',
	},
	pending_payments: {
		icon: 'i-heroicons-credit-card',
	},
	pending_actions: {
		icon: 'i-heroicons-bell',
		to: '/analytics',
	},
	revenue: {
		icon: 'i-heroicons-currency-dollar',
		formatter: (v) => formatCurrency(v, total_order_amt.value?.[0]?.currency_code ?? 'MYR'),
	},
	new_customers: {
		icon: 'i-heroicons-user-plus',
		to: '/customers',
	},
};

const visibleStats = computed(() => {
	const selected = selectedKeys.value;
	return selected.map((key) => {
		const def = statDefs[key];
		let value: number;
		switch (key) {
			case 'appointment_orders':
				value = new_appointments.value ?? 0;
				break;
			case 'item_orders':
				value = new_orders.value ?? 0;
				break;
			case 'pending_payments':
				value = pending_payments.value ?? 0;
				break;
			case 'pending_actions':
				value = pending_actions.value ?? 0;
				break;
			case 'revenue': {
				const amts = total_order_amt.value ?? [];
				value = amts.reduce((acc, c) => acc + (c.total_order_amt ?? 0), 0);
				break;
			}
			case 'new_customers':
				value = new_customers.value ?? 0;
				break;
			default:
				value = 0;
		}
		const formattedValue = def.formatter ? def.formatter(value) : String(value);
		return {
			key,
			title: statLabel(key),
			icon: def.icon,
			to: def.to,
			formattedValue,
		};
	});
});
</script>
