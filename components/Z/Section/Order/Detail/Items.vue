<template>
	<table class="w-full">
		<thead>
			<tr class="border-b">
				<th class="cell-header text-left">Item</th>
				<th class="cell-header">Unit Sell Price</th>
				<th class="cell-header">Qty</th>
				<th class="cell-header">Price</th>
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
								<UIcon :name="ICONS.CHECK_OUTLINE_ROUNDED" class="text-green-500 w-5 h-5" />
							</div>
							<div v-else-if="item.status == OrderItemStatus.REFUNDED">
								<UIcon :name="ICONS.ERROR_OUTLINE" class="text-red-500 w-5 h-5" />
							</div>
							<div v-else-if="item.status == OrderItemStatus.VOIDED">
								<UIcon :name="ICONS.ERROR_OUTLINE" class="text-red-500 w-5 h-5" />
							</div>
						</div>

						<div class="ml-2">
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
							<div v-if="item.appointment" class="flex items-center gap-2 mt-2">
								<UIcon :name="ICONS.CALENDAR" class="w-5 h-5" />
								<div class="flex flex-col text-xs font-bold italic">
									<span class="text-neutral-400">{{ item.appointment.code }}</span>
									<span class="text-main">{{ getFormattedDate(item.appointment.date_time, 'dd MMM yyyy hh:mm a') }}</span>
								</div>
							</div>
						</div>
					</div>
				</td>

				<td class="cell-center" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">
					{{ formatCurrency(item.unit_sell_price, currencyCode) }}
				</td>
				<td class="cell-center" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.qty }}</td>
				<td class="cell-center" :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">
					{{ item.status == OrderItemStatus.ACTIVE ? formatCurrency(item.net_amt, currencyCode) : 0 }}
				</td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<td colspan="2"></td>
				<td class="cell-header border-b">Sub Total</td>
				<td class="cell-center font-bold text-lg italic border-b">{{ formatCurrency(totalGrossAmt ?? 0, currencyCode) }}</td>
			</tr>
			<tr v-for="tax in taxes" :key="tax.tax_code">
				<td colspan="2"></td>
				<td class="cell-header border-b">{{ tax.tax_desc }}</td>
				<td class="cell-center text-red-500 italic border-b">-{{ formatCurrency(tax.tax_amt, currencyCode) }}</td>
			</tr>
			<tr>
				<td colspan="2"></td>
				<td class="cell-header border-b-4 border-double">Net Total</td>
				<td class="cell-center font-bold text-lg italic border-b-4 border-double">{{ formatCurrency(totalNetAmt ?? 0, currencyCode) }}</td>
			</tr>
		</tfoot>
	</table>
</template>

<script lang="ts" setup>
import { ZModalInformation, ZModalOrderDetailItem } from '#components';
import { OrderItemStatus, getFormattedDate } from 'wemotoo-common';
import type { ItemModel } from '~/utils/models/item.model';
import type { TaxModel } from '~/utils/models/tax.model';

defineProps<{
	items: ItemModel[];
	taxes: TaxModel[];
	currencyCode: string | undefined;
	totalGrossAmt: number | undefined;
	totalNetAmt: number | undefined;
	editable: boolean;
}>();

const emit = defineEmits(['refresh']);

const overlay = useOverlay();
const editItem = (item: ItemModel) => {
	if (item.status == OrderItemStatus.ACTIVE) {
		const itemModal = overlay.create(ZModalOrderDetailItem, {
			props: {
				item: JSON.parse(JSON.stringify(item)),
				onCancel: () => {
					itemModal.close();
				},
				onUpdate: (requiresRefresh: boolean) => {
					if (requiresRefresh) {
						emit('refresh');
					}
					itemModal.close();
				},
			},
		});

		itemModal.open();
	} else {
		const infoModal = overlay.create(ZModalInformation, {
			props: {
				title: 'Warning',
				message: 'Unable to edit this item because it is already voided by customer.',
				action: 'confirm',
				onConfirm: () => {
					infoModal.close();
				},
			},
		});

		infoModal.open();
	}
};
</script>

<style scoped>
.order-detail-item {
	display: flex;
	flex-direction: column;
}

@media (min-width: 640px) {
	.order-detail-item {
		flex-direction: row;
	}
}

.order-detail-item span:first-child {
	width: 100%;
	color: var(--color-neutral-400);
}

@media (min-width: 640px) {
	.order-detail-item span:first-child {
		width: 200px;
	}
}

@media (min-width: 1024px) {
	.order-detail-item span:first-child {
		width: 240px;
	}
}

.order-detail-item span:last-child {
	font-weight: 500;
	color: var(--color-neutral-800);
}

.cell-header {
	padding: 1rem;
	color: var(--color-neutral-400);
	font-weight: 400;
	font-style: italic;
}

.cell-item {
	padding: 1rem;
	text-align: left;
	width: 400px;
}

.cell-center {
	padding: 1rem;
	text-align: center;
}

.editable-cell {
	cursor: pointer;
	transition: background-color 150ms;
}

.editable-cell:hover {
	background-color: var(--color-neutral-50);
}
</style>
