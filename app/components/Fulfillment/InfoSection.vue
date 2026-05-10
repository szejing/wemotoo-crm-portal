<script setup lang="ts">
import { getFulfillmentStatusColor } from '~/utils/options';
import type {
	FulfillmentLifecycleStatusValue,
	OrderFulfillment,
} from '~/utils/types/order-fulfillment-shipping';

const props = defineProps<{
	fulfillment?: OrderFulfillment;
	isReadOnly?: boolean;
	loading?: boolean;
}>();

const emit = defineEmits<{
	(e: 'action', action: 'processing' | 'packed' | 'fulfilled'): void;
}>();

const fallbackStatus: FulfillmentLifecycleStatusValue = 'pending';

const status = computed(() => props.fulfillment?.status ?? fallbackStatus);
const statusLabel = computed(() => {
	const labels: Record<FulfillmentLifecycleStatusValue, string> = {
		pending: 'options.pending',
		processing: 'options.processing',
		packed: 'options.packed',
		fulfilled: 'options.fulfilled',
	};

	return labels[status.value];
});

const packedAt = computed(() => {
	if (!props.fulfillment?.packed_at) {
		return '-';
	}

	return new Date(props.fulfillment.packed_at).toLocaleString();
});
</script>

<template>
	<UCard>
		<template #header>
			<div class="flex items-center justify-between gap-3">
				<h3 class="text-base font-semibold">{{ $t('components.fulfillment.title') }}</h3>
				<UBadge :color="getFulfillmentStatusColor(status)">
					{{ $t(statusLabel) }}
				</UBadge>
			</div>
		</template>

		<div class="space-y-4">
			<div class="text-sm text-muted">
				<p>{{ $t('components.fulfillment.currentStatus') }}: {{ $t(statusLabel) }}</p>
				<p>{{ $t('components.fulfillment.packedAt') }}: {{ packedAt }}</p>
			</div>

			<FulfillmentActions
				:status="status"
				:is-read-only="isReadOnly"
				:loading="loading"
				@action="emit('action', $event)"
			/>

			<p v-if="isReadOnly" class="text-xs text-muted">
				{{ $t('components.fulfillment.readOnlyHint') }}
			</p>
		</div>
	</UCard>
</template>
