<template>
	<ZPagePanel id="analytics-orders" :title="$t('nav.analytics')" back-to="/analytics">
		<div class="space-y-8">
			<!-- Header -->
			<div class="space-y-2">
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('pages.orderAnalytics') }}</h2>
				<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.orderDashboardDesc') }}</p>
			</div>

			<!-- Date range + load -->
			<div class="flex flex-wrap items-center gap-3">
				<ZSelectMenuDateRange v-model="range" :placeholder="$t('components.filter.selectDateRange')" @update:model-value="onRangeChange" />
			</div>

			<!-- Stats row -->
			<ZDashboardStats :stats="orderStats" />

			<!-- Revenue chart -->
			<UCard ref="chartCardRef" :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
				<template #header>
					<div>
						<div class="flex flex-col sm:flex-row justify-between gap-2 items-center">
							<p class="text-xs text-muted uppercase">{{ $t('components.dashboard.revenue') }}</p>
							<p class="text-2xl sm:text-3xl font-semibold text-highlighted">
								{{ formatCurrency(chartTotal, primaryCurrency) }}
							</p>
						</div>
					</div>
				</template>
				<ClientOnly>
					<VisXYContainer :data="chartData" :padding="{ top: 40 }" class="h-80" :width="chartWidth">
						<VisLine :x="chartX" :y="chartY" color="var(--ui-primary)" />
						<VisArea :x="chartX" :y="chartY" color="var(--ui-primary)" :opacity="0.1" />
						<VisAxis type="x" :x="chartX" :tick-format="chartXTicks" />
						<VisCrosshair color="var(--ui-primary)" :template="chartTooltipTemplate" />
						<VisTooltip />
					</VisXYContainer>
					<template #fallback>
						<div class="h-80 flex items-center justify-center text-muted">
							<UIcon name="i-heroicons-chart-bar" class="w-12 h-12 opacity-50" />
						</div>
					</template>
				</ClientOnly>
			</UCard>

			<!-- Top products & Top customers -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<UCard>
					<template #header>
						<div class="flex items-center gap-2">
							<UIcon name="i-heroicons-cube" class="w-5 h-5 text-primary" />
							<h3 class="font-semibold text-highlighted">{{ $t('pages.orderDashboardTopProducts') }}</h3>
						</div>
					</template>
					<div v-if="top_purchased_products.length === 0" class="py-8 text-center text-muted text-sm">
						{{ $t('pages.orderDashboardNoData') }}
					</div>
					<ul v-else class="divide-y divide-border">
						<li
							v-for="(product, i) in top_purchased_products.slice(0, 8)"
							:key="product.prod_code"
							class="flex items-center justify-between gap-3 py-3 first:pt-0"
						>
							<div class="flex items-center gap-3 min-w-0">
								<span class="shrink-0 w-6 text-xs font-medium text-muted">{{ i + 1 }}</span>
								<span class="truncate font-medium text-highlighted">{{ product.prod_name }}</span>
							</div>
							<div class="flex shrink-0 items-center gap-2 text-sm">
								<span class="text-muted">{{ product.total_qty }} {{ $t('table.qty') }}</span>
								<span class="font-medium">{{ formatCurrency(product.total_net_amt, 'MYR') }}</span>
							</div>
						</li>
					</ul>
				</UCard>

				<UCard>
					<template #header>
						<div class="flex items-center gap-2">
							<UIcon name="i-heroicons-users" class="w-5 h-5 text-primary" />
							<h3 class="font-semibold text-highlighted">{{ $t('pages.orderDashboardTopCustomers') }}</h3>
						</div>
					</template>
					<div v-if="top_purchased_customers.length === 0" class="py-8 text-center text-muted text-sm">
						{{ $t('pages.orderDashboardNoData') }}
					</div>
					<ul v-else class="divide-y divide-border">
						<li
							v-for="(customer, i) in top_purchased_customers.slice(0, 8)"
							:key="customer.customer_no"
							class="flex items-center justify-between gap-3 py-3 first:pt-0"
						>
							<div class="flex items-center gap-3 min-w-0">
								<span class="shrink-0 w-6 text-xs font-medium text-muted">{{ i + 1 }}</span>
								<span class="truncate font-medium text-highlighted">{{ customer.customer_name }}</span>
							</div>
							<div class="flex shrink-0 items-center gap-2 text-sm">
								<span class="text-muted">{{ customer.total_orders }} {{ $t('pages.ordersLabel') }}</span>
								<span class="font-medium">{{ formatCurrency(customer.total_spent, 'MYR') }}</span>
							</div>
						</li>
					</ul>
				</UCard>
			</div>

			<!-- Reports navigation -->
			<ZMenu
				:title="$t('pages.orderAnalytics')"
				:icon="ICONS.REPORT_ORDER"
				:description="$t('pages.orderSummaryDesc')"
				color="primary"
				:navigations="order_navigations"
			/>
		</div>
	</ZPagePanel>
</template>

<script lang="ts" setup>
import { VisXYContainer, VisLine, VisAxis, VisArea, VisCrosshair, VisTooltip } from '@unovis/vue';
import { getFormattedDate, parseDate, formatCurrency } from 'wemotoo-common';
import { sub } from 'date-fns';
import type { Range } from '~/utils/interface';

const { t } = useI18n();
useHead({ title: () => t('pages.analyticsTitle') });

const summOrderStore = useSummOrderStore();
const { daily_summaries, top_purchased_customers, top_purchased_products, new_orders, new_customers, total_order_amt, pending_payments, pending_actions } =
	storeToRefs(summOrderStore);

const range = shallowRef<Range>({
	start: sub(new Date(), { days: 7 }),
	end: new Date(),
});

const chartCardRef = useTemplateRef<HTMLElement | null>('chartCardRef');
const { width: chartWidth } = useElementSize(chartCardRef);

const primaryCurrency = computed(() => total_order_amt.value[0]?.currency_code ?? 'MYR');

const orderStats = computed(() => [
	{
		title: t('pages.orderDashboardTotalOrdersAmt'),
		value: formatCurrency(total_order_amt.value[0]?.total_order_amt ?? 0, primaryCurrency.value),
		icon: 'i-heroicons-banknotes',
		iconBg: 'bg-green-500/10',
		iconColor: 'text-green-600 dark:text-green-400',
		to: '/analytics/orders/summary',
	},
	{
		title: t('pages.orderDashboardNewOrders'),
		value: new_orders.value ?? 0,
		icon: 'i-heroicons-shopping-cart',
		iconBg: 'bg-primary/10',
		iconColor: 'text-primary',
		to: '/sales/orders',
	},
	{
		title: t('pages.orderDashboardNewCustomers'),
		value: new_customers.value ?? 0,
		icon: 'i-heroicons-user-plus',
		iconBg: 'bg-secondary/10',
		iconColor: 'text-secondary',
		to: '/customers',
	},
	{
		title: t('pages.orderDashboardPendingPayments'),
		value: pending_payments.value ?? 0,
		icon: 'i-heroicons-credit-card',
		iconBg: 'bg-amber-500/10',
		iconColor: 'text-amber-600 dark:text-amber-400',
		to: undefined,
	},
]);

const chartData = computed(() =>
	daily_summaries.value.map((s) => ({
		date: s.summ_order.biz_date,
		amount: s.summ_order.total_net_amt,
	})),
);

const chartTotal = computed(() => chartData.value.reduce((acc, d) => acc + d.amount, 0));

const chartX = (_: { date: string; amount: number }, i: number) => i;
const chartY = (d: { date: string; amount: number }) => d.amount;

const chartXTicks = (i: number) => {
	if (i === 0 || i === chartData.value.length - 1 || !chartData.value[i]) return '';
	return getFormattedDate(parseDate(chartData.value[i].date), 'dd MMM yyyy');
};

const chartTooltipTemplate = (d: { date: string; amount: number }) =>
	`${getFormattedDate(parseDate(d.date), 'dd MMM yyyy')}: ${formatCurrency(d.amount, primaryCurrency.value)}`;

async function onRangeChange(newValue: Range) {
	range.value = newValue;
	await summOrderStore.getDashboardSummary(newValue);
}

const order_navigations = computed(() => [
	{
		title: t('pages.orderSummary'),
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/summary',
		description: t('pages.orderSummaryDesc'),
	},
	{
		title: t('pages.orderItem'),
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/items',
		description: t('pages.orderItemDesc'),
	},
	{
		title: t('pages.orderCustomer'),
		icon: ICONS.REPORT_ORDER,
		to: '/analytics/orders/customers',
		description: t('pages.orderCustomerDesc'),
	},
]);

onMounted(() => {
	summOrderStore.getDashboardSummary(range.value);
});
</script>

<style scoped>
:deep(.unovis-xy-container) {
	--vis-crosshair-line-stroke-color: var(--ui-primary);
	--vis-crosshair-circle-stroke-color: var(--ui-bg);
	--vis-axis-grid-color: var(--ui-border);
	--vis-axis-tick-color: var(--ui-border);
	--vis-axis-tick-label-color: var(--ui-text-dimmed);
	--vis-tooltip-background-color: var(--ui-bg);
	--vis-tooltip-border-color: var(--ui-border);
	--vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
