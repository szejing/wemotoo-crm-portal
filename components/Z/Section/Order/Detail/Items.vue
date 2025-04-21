<template>
	<table class="w-full">
		<thead>
			<tr class="border-b">
				<th class="cell-header">Code</th>
				<th class="cell-header">Item Status</th>
				<th class="cell-header">Qty</th>
				<th class="cell-header">Gross Amt ({{ currencyCode }})</th>
				<th class="cell-header">Net Amt ({{ currencyCode }})</th>
				<th class="cell-header">Total Amt ({{ currencyCode }})</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in items" :key="item.prod_code" class="border-b">
				<td class="cell">
					<span class="font-medium" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.prod_code }}</span>
					<br />
					<span
						class="text-xs"
						:class="{
							'italic text-neutral-300': item.status == OrderItemStatus.VOIDED,
							'text-neutral-500': item.status == OrderItemStatus.ACTIVE,
						}"
					>
						{{ item.prod_name.substring(0, 10) }}
					</span>
				</td>
				<td class="cell">
					<UBadge v-if="item.status == OrderItemStatus.ACTIVE" variant="outline" color="green">ACTIVE</UBadge>
					<UBadge v-else-if="item.status == OrderItemStatus.REFUNDED" variant="outline" color="red">REFUNDED</UBadge>
					<UBadge v-else-if="item.status == OrderItemStatus.VOIDED" variant="outline" color="red">VOIDED</UBadge>
				</td>
				<td class="cell" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.order_qty }}</td>
				<td class="cell" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.gross_amt.toFixed(2) }}</td>
				<td class="cell" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.net_amt.toFixed(2) }}</td>
				<td class="cell" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">
					{{ item.status == OrderItemStatus.ACTIVE ? (item.net_amt * item.order_qty).toFixed(2) : 0 }}
				</td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<td colspan="4"></td>
				<td class="cell-header text-right border-b">Sub Total ({{ currencyCode }})</td>
				<td class="cell font-bold text-lg italic border-b">{{ totalGrossAmt.toFixed(2) }}</td>
			</tr>
			<tr>
				<td colspan="4"></td>
				<td class="cell-header text-right border-b-4 border-double">Total ({{ currencyCode }})</td>
				<td class="cell font-bold text-lg italic border-b-4 border-double">{{ totalNetAmt.toFixed(2) }}</td>
			</tr>
		</tfoot>
	</table>
</template>

<script lang="ts" setup>
import { OrderItemStatus } from 'wemotoo-common';
import type { OrderItemModel } from '~/utils/models/item.model';

defineProps<{
	items: OrderItemModel[];
	currencyCode: string;
	totalGrossAmt: number;
	totalNetAmt: number;
}>();
</script>

<style scoped lang="postcss">
.order-detail-item {
	@apply flex flex-col sm:flex-row;
}

.order-detail-item span:first-child {
	@apply w-full sm:w-[200px] lg:w-[240px] text-neutral-400;
}

.order-detail-item span:last-child {
	@apply font-medium text-neutral-800;
}

.cell-header {
	@apply p-4 text-gray-400 font-normal italic;
}

.cell {
	@apply p-4 text-center;
}
</style>
