<template>
	<ZPagePanel id="analytics-sales" :title="$t('nav.analytics')">

			<div class="space-y-8">
				<!-- Header -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('pages.salesAnalytics') }}</h2>
					<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.salesDashboardDesc') }}</p>
				</div>

				<!-- Date range -->
				<div class="flex flex-wrap items-center gap-3">
					<ZSelectMenuDateRange v-model="range" :placeholder="$t('components.filter.selectDateRange')" @update:model-value="onRangeChange" />
				</div>

				<!-- Stats row -->
				<ZDashboardStats :stats="salesStats" />

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
								<h3 class="font-semibold text-highlighted">{{ $t('pages.salesDashboardTopProducts') }}</h3>
							</div>
						</template>
						<div v-if="top_purchased_products.length === 0" class="py-8 text-center text-muted text-sm">
							{{ $t('pages.salesDashboardNoData') }}
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
								<h3 class="font-semibold text-highlighted">{{ $t('pages.salesDashboardTopCustomers') }}</h3>
							</div>
						</template>
						<div v-if="top_purchased_customers.length === 0" class="py-8 text-center text-muted text-sm">
							{{ $t('pages.salesDashboardNoData') }}
						</div>
						<ul v-else class="divide-y divide-border">
							<li
								v-for="(customer, i) in top_purchased_customers.slice(0, 8)"
								:key="customer.customer_no"
								class="flex items-center justify-between gap-3 py-3 first:pt-0"
							>
								<div class="flex items-center gap-3 min-w-0">
									<span class="shrink-0 w-6 text-xs font-medium text-muted">{{ i + 1 }}</span>
									<span class="truncate font-medium text-highlighted">{{ customer.customer_no }}</span>
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
					:title="$t('pages.salesAnalytics')"
					:icon="ICONS.REPORT_SALES"
					:description="$t('pages.salesAnalyticsDesc')"
					color="green"
					:navigations="sales_navigations"
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

const summSaleStore = useSummSaleStore();
const { daily_summaries, top_purchased_customers, top_purchased_products } = storeToRefs(summSaleStore);

const range = shallowRef<Range>({
	start: sub(new Date(), { days: 7 }),
	end: new Date(),
});

const chartCardRef = useTemplateRef<HTMLElement | null>('chartCardRef');
const { width: chartWidth } = useElementSize(chartCardRef);

// Support both summ_order (orders API) and summ_sale/summ_sale_item (sales API) shapes
function getDailyChartPoint(s: (typeof daily_summaries.value)[number]) {
	const rec = s as {
		biz_date?: string;
		summ_order?: { biz_date: string; total_net_amt: number; currency_code?: string };
		summ_sale?: { biz_date: string; total_net_amt?: number; currency_code?: string };
		summ_sale_item?: { total_net_amt: number; currency_code?: string };
	};
	const date = rec.biz_date ?? rec.summ_order?.biz_date ?? rec.summ_sale?.biz_date ?? '';
	const amount = rec.summ_order?.total_net_amt ?? rec.summ_sale?.total_net_amt ?? rec.summ_sale_item?.total_net_amt ?? 0;
	return { date, amount };
}

const chartData = computed(() => daily_summaries.value.map(getDailyChartPoint));

const primaryCurrency = computed(() => {
	const first = daily_summaries.value[0];
	if (!first) return 'MYR';
	const rec = first as {
		summ_order?: { currency_code?: string };
		summ_sale?: { currency_code?: string };
		summ_sale_item?: { currency_code?: string };
	};
	return rec.summ_order?.currency_code ?? rec.summ_sale?.currency_code ?? rec.summ_sale_item?.currency_code ?? 'MYR';
});

const chartTotal = computed(() => chartData.value.reduce((acc, d) => acc + d.amount, 0));

const totalQtySum = computed(() =>
	daily_summaries.value.reduce((acc, s) => {
		const rec = s as { summ_order?: { total_qty: number }; summ_sale?: { total_qty: number }; summ_sale_item?: { total_qty: number } };
		const n = rec.summ_order?.total_qty ?? rec.summ_sale?.total_qty ?? rec.summ_sale_item?.total_qty ?? 0;
		return acc + n;
	}, 0),
);

const salesStats = computed(() => [
	{
		title: t('pages.salesDashboardTotalSales'),
		value: formatCurrency(chartTotal.value, primaryCurrency.value),
		icon: 'i-heroicons-banknotes',
		iconBg: 'bg-green-500/10',
		iconColor: 'text-green-600 dark:text-green-400',
		to: '/analytics/sales/summary',
	},
	{
		title: t('pages.salesDashboardTotalQty'),
		value: totalQtySum.value,
		icon: 'i-heroicons-cube',
		iconBg: 'bg-secondary/10',
		iconColor: 'text-secondary',
		to: '/analytics/sales/items',
	},
	{
		title: t('pages.salesDashboardTopProducts'),
		value: top_purchased_products.value.length,
		icon: 'i-heroicons-squares-2x2',
		iconBg: 'bg-amber-500/10',
		iconColor: 'text-amber-600 dark:text-amber-400',
		to: '/analytics/sales/items',
	},
]);

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
	await summSaleStore.getDashboardSummary(newValue);
}

const sales_navigations = computed(() => [
	{
		title: t('pages.salesSummary'),
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/summary',
		description: t('pages.salesSummaryDesc'),
	},
	{
		title: t('pages.salesItems'),
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/items',
		description: t('pages.salesItemsDesc'),
	},
	{
		title: t('pages.salesPayment'),
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/payments',
		description: t('pages.salesPaymentDesc'),
	},
	{
		title: t('pages.salesCustomer'),
		icon: ICONS.REPORT_SALES,
		to: '/analytics/sales/customers',
		description: t('pages.salesCustomerDesc'),
	},
]);

onMounted(() => {
	summSaleStore.getDashboardSummary(range.value);
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
