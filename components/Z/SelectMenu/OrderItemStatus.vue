<template>
	<UFormField name="status">
		<USelectMenu v-model="status" :items="statusItems" value-key="label" size="md">
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
	</UFormField>
</template>

<script lang="ts" setup>
import { options_order_item_status, getOrderItemStatusColor } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ status: string }>();
const emit = defineEmits(['update:status']);

const statusItems = computed(() => {
	return options_order_item_status.map((status) => ({ label: status }));
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
