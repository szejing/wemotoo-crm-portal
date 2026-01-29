<template>
	<USelectMenu v-model="status" :items="items" value-key="label" size="md" placeholder="Select Order Status">
		<template #default>
			<span v-if="status">
				<UBadge :color="getOrderStatusColor(status)" variant="subtle" class="truncate">
					{{ capitalizeFirstLetter(status) }}
				</UBadge>
			</span>
			<span v-else class="text-neutral-400">Select Order Status</span>
		</template>

		<template #item="{ item }">
			<UBadge :color="getOrderStatusColor(item.label)" variant="subtle" class="truncate">
				{{ capitalizeFirstLetter(item.label) }}
			</UBadge>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import { OrderStatus } from 'wemotoo-common';
import { options_order_status, getOrderStatusColor } from '~/utils/options';

const props = defineProps<{ status: OrderStatus | undefined }>();
const emit = defineEmits(['update:status']);

const statuses = computed(() => {
	return options_order_status.filter((status) => status !== OrderStatus.REQUIRES_ACTION && status !== OrderStatus.REFUNDED);
});

const items = computed(() => {
	return statuses.value.map((status) => ({ label: status }));
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
