<template>
	<template v-if="column === 'item'">
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
						{{ formatAppointmentDateRange(item.appointment.start_date_time, item.appointment.end_date_time) }}
					</div>
				</div>
			</div>
		</div>
	</template>
	<template v-else-if="column === 'unitSellPrice'">
		<span :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">
			{{ formatCurrency(item.unit_sell_price, currencyCode) }}
		</span>
	</template>
	<template v-else-if="column === 'qty'">
		<span :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">{{ item.qty }}</span>
	</template>
	<template v-else-if="column === 'lineTotal'">
		<span :class="{ 'italic text-neutral-300': item.status == OrderItemStatus.VOIDED }">
			{{ item.status == OrderItemStatus.ACTIVE ? formatCurrency(item.net_amt, currencyCode) : 0 }}
		</span>
	</template>
</template>

<script lang="ts" setup>
import { OrderItemStatus, formatCurrency } from 'yeppi-common';
import type { ItemModel } from '~/utils/models/item.model';
import { ICONS } from '~/utils/icons';
import { formatAppointmentDateRange } from '~/utils/utils';

export type OrderDetailItemsColumn = 'item' | 'unitSellPrice' | 'qty' | 'lineTotal';

defineProps<{
	item: ItemModel;
	column: OrderDetailItemsColumn;
	currencyCode: string | undefined;
}>();
</script>
