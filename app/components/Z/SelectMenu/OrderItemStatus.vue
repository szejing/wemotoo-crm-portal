<template>
	<USelectMenu v-model="status" :items="items" value-key="label" size="md" placeholder="Select Order Item Status">
		<template #default>
			<span v-if="status">
				<UBadge :color="getOrderItemStatusColor(status)" variant="subtle" class="truncate">
					{{ capitalizeFirstLetter(status) }}
				</UBadge>
			</span>
			<span v-else class="text-neutral-400">Select Order Item Status</span>
		</template>

		<template #item="{ item }">
			<UBadge :color="getOrderItemStatusColor(item.label)" variant="subtle" class="truncate">
				{{ capitalizeFirstLetter(item.label) }}
			</UBadge>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import type { OrderItemStatus } from 'wemotoo-common';
import { options_order_item_status, getOrderItemStatusColor } from '~/utils/options';

const props = defineProps<{ status: OrderItemStatus | undefined }>();
const emit = defineEmits(['update:status']);

const items = computed(() => {
	return options_order_item_status.map((status) => ({ label: status }));
});

const status = computed({
	get() {
		return props.status ?? 'All';
	},
	set(value) {
		if (value === 'All') {
			emit('update:status', undefined);
		} else {
			emit('update:status', value);
		}
	},
});
</script>

<style scoped></style>
