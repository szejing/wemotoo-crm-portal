<template>
	<USelectMenu v-model="status" :items="items" value-key="label" size="md" placeholder="Select Product Status">
		<template #default>
			<span v-if="status">
				<UBadge :color="getProductStatusColor(status)" variant="subtle" class="truncate">
					{{ capitalizeFirstLetter(status) }}
				</UBadge>
			</span>
			<span v-else class="text-neutral-400">Select Product Status</span>
		</template>

		<template #item="{ item }">
			<UBadge :color="getProductStatusColor(item.label)" variant="subtle" class="truncate">
				{{ capitalizeFirstLetter(item.label) }}
			</UBadge>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import type { ProductStatus } from 'wemotoo-common';
import { options_product_status, getProductStatusColor } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ status: ProductStatus | undefined }>();
const emit = defineEmits(['update:status']);

const items = computed(() => {
	return options_product_status.map((status) => ({ label: status }));
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
