<template>
	<table class="w-full">
		<thead>
			<tr class="border-b">
				<th class="cell-header text-left">Item</th>
				<th class="cell-header">Cost ({{ currencyCode }})</th>
				<th class="cell-header">Qty</th>
				<th class="cell-header">Total Amt ({{ currencyCode }})</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="item in items"
				:key="item.prod_code"
				class="border-b"
				:class="{ 'editable-cell': editable && item.status == OrderItemStatus.ACTIVE }"
				@click="editable && item.status == OrderItemStatus.ACTIVE && editItem(item)"
			>
				<td class="cell-item">
					<div class="flex items-center gap-2">
						<div>
							<div v-if="item.status == OrderItemStatus.ACTIVE">
								<UIcon :name="ICONS.CHECK_OUTLINE_ROUNDED" class="text-green-500" />
							</div>
							<div v-else-if="item.status == OrderItemStatus.REFUNDED">
								<UIcon :name="ICONS.ERROR_OUTLINE" class="text-red-500" />
							</div>
							<div v-else-if="item.status == OrderItemStatus.VOIDED">
								<UIcon :name="ICONS.ERROR_OUTLINE" class="text-red-500" />
							</div>
						</div>

						<div>
							<div class="font-medium" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.prod_code }}</div>
							<div
								class="text-xs"
								:class="{
									'italic text-neutral-300': item.status == OrderItemStatus.VOIDED,
									'text-neutral-500': item.status == OrderItemStatus.ACTIVE,
								}"
							>
								{{ item.prod_name.substring(0, 10) }}
							</div>
							<div v-if="item.prod_variant_code" class="text-xs italic text-neutral-300">{{ item.prod_variant_code }} : {{ item.prod_variant_name }}</div>
						</div>
					</div>
				</td>

				<td class="cell-center" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">
					{{ item.unit_sell_price.toFixed(2) }}
				</td>
				<td class="cell-center" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.qty }}</td>
				<td class="cell-center" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">
					{{ item.status == OrderItemStatus.ACTIVE ? item.net_amt.toFixed(2) : 0 }}
				</td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<td colspan="2"></td>
				<td class="cell-header text-right border-b">Sub Total ({{ currencyCode }})</td>
				<td class="cell-center font-bold text-lg italic border-b">{{ totalGrossAmt?.toFixed(2) ?? 0 }}</td>
			</tr>
			<tr>
				<td colspan="2"></td>
				<td class="cell-header text-right border-b-4 border-double">Total ({{ currencyCode }})</td>
				<td class="cell-center font-bold text-lg italic border-b-4 border-double">{{ totalNetAmt?.toFixed(2) ?? 0 }}</td>
			</tr>
		</tfoot>
	</table>
</template>

<script lang="ts" setup>
import { ZModalInformation, ZModalOrderDetailItem } from '#components';
import { OrderItemStatus } from 'wemotoo-common';
import type { ItemModel } from '~/utils/models/item.model';

defineProps<{
	items: ItemModel[];
	currencyCode: string | undefined;
	totalGrossAmt: number | undefined;
	totalNetAmt: number | undefined;
	editable: boolean;
}>();

const emit = defineEmits(['refresh']);

const modal = useModal();
const editItem = (item: ItemModel) => {
	if (item.status == OrderItemStatus.ACTIVE) {
		modal.open(ZModalOrderDetailItem, {
			item: JSON.parse(JSON.stringify(item)),
			onCancel: () => {
				modal.close();
			},
			onUpdate: (requiresRefresh: boolean) => {
				if (requiresRefresh) {
					emit('refresh');
				}
				modal.close();
			},
		});
	} else {
		modal.open(ZModalInformation, {
			title: 'Warning',
			message: 'Unable to edit this item because it is already voided by customer.',
			action: 'confirm',
			onConfirm: () => {
				modal.close();
			},
		});
	}
};
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

.cell-item {
	@apply p-4 text-left w-[400px];
}

.cell-center {
	@apply p-4 text-center;
}

.editable-cell {
	@apply cursor-pointer transition hover:bg-neutral-50;
}
</style>
