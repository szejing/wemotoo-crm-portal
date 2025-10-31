<template>
	<UFormField name="status">
		<USelectMenu v-model="status" :items="statusItems" value-key="label" size="md" :ui="{ base: 'min-w-[150px]' }">
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
	</UFormField>
</template>

<script lang="ts" setup>
import { OrderStatus } from 'wemotoo-common';
import { options_order_status, getOrderStatusColor } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ status: string }>();
const emit = defineEmits(['update:status']);

const statuses = computed(() => {
	return options_order_status.filter((status) => status !== OrderStatus.REQUIRES_ACTION && status !== OrderStatus.REFUNDED);
});

const statusItems = computed(() => {
	return statuses.value.map((status) => ({ label: status }));
});

const status = computed({
	get() {
		return props.status;
	},
	set(value) {
		emit('update:status', value);
	},
});
</script>

<style scoped></style>
