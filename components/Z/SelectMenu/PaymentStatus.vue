<template>
	<USelectMenu v-model="status" :items="items" value-key="label" size="md" placeholder="Select Payment Status">
		<template #default>
			<span v-if="status">
				<UBadge :color="getPaymentStatusColor(status)" variant="subtle" class="truncate">
					{{ capitalizeFirstLetter(status) }}
				</UBadge>
			</span>
			<span v-else class="text-neutral-400">Select Payment Status</span>
		</template>

		<template #item="{ item }">
			<UBadge :color="getPaymentStatusColor(item.label)" variant="subtle" class="truncate">
				{{ capitalizeFirstLetter(item.label) }}
			</UBadge>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import type { PaymentStatus } from 'wemotoo-common';
import { options_payment_status, getPaymentStatusColor } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ paymentStatus: PaymentStatus | undefined }>();
const emit = defineEmits(['update:paymentStatus']);

const items = computed(() => {
	return options_payment_status.map((status) => ({ label: status }));
});

const status = computed({
	get() {
		return props.paymentStatus;
	},
	set(value) {
		emit('update:paymentStatus', value);
	},
});
</script>

<style scoped></style>
