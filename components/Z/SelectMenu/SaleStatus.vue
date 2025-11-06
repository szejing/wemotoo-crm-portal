<template>
	<USelectMenu v-model="status" :items="items" value-key="label" size="md" placeholder="Select Sale Status">
		<template #default>
			<span v-if="status">
				<UBadge :color="getSaleStatusColor(status)" variant="subtle" class="truncate">
					{{ capitalizeFirstLetter(status) }}
				</UBadge>
			</span>
			<span v-else class="text-neutral-400">Select Status</span>
		</template>

		<template #item="{ item }">
			<UBadge :color="getSaleStatusColor(item.label)" variant="subtle" class="truncate">
				{{ capitalizeFirstLetter(item.label) }}
			</UBadge>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import { options_sale_status, getSaleStatusColor } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary
import type { SaleStatus } from 'wemotoo-common';

const props = defineProps<{ status: SaleStatus | undefined }>();
const emit = defineEmits(['update:status']);

const items = computed(() => {
	return options_sale_status.map((status) => ({ label: status }));
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
