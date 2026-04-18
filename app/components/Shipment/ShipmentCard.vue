<script setup lang="ts">
import { getShipmentStatusColor } from '~/utils/options';
import type { OrderShipment } from '~/utils/types/order-fulfillment-shipping';

const props = defineProps<{
	shipment?: OrderShipment;
	isReadOnly?: boolean;
	loading?: boolean;
}>();

const emit = defineEmits<{
	(e: 'create'): void;
	(e: 'edit'): void;
	(e: 'delete'): void;
	(e: 'mark-delivered'): void;
}>();

const statusLabel = computed(() => {
	if (!props.shipment) {
		return 'options.pending';
	}

	const labels: Record<string, string> = {
		pending: 'options.pending',
		shipped: 'options.shipped',
		in_transit: 'options.inTransit',
		delivered: 'options.delivered',
		failed: 'options.failed',
	};

	return labels[props.shipment.status] ?? 'options.pending';
});

const canMarkDelivered = computed(() => {
	return props.shipment?.status === 'shipped' || props.shipment?.status === 'in_transit';
});
</script>

<template>
	<UCard>
		<template #header>
			<div class="flex items-center justify-between gap-3">
				<h3 class="text-base font-semibold">{{ $t('components.shipment.title') }}</h3>
				<UBadge :color="getShipmentStatusColor(shipment?.status ?? 'pending')">
					{{ $t(statusLabel) }}
				</UBadge>
			</div>
		</template>

		<div v-if="shipment" class="space-y-3 text-sm">
			<p>{{ $t('components.shipment.courierName') }}: {{ shipment.courier_name }}</p>
			<p>{{ $t('components.shipment.trackingNo') }}: {{ shipment.tracking_no }}</p>
			<p>{{ $t('components.shipment.shippingFee') }}: {{ shipment.shipping_fee }}</p>

			<div class="flex flex-wrap gap-2">
				<UButton
					size="sm"
					color="neutral"
					variant="soft"
					:disabled="isReadOnly || loading"
					@click="emit('edit')"
				>
					{{ $t('common.edit') }}
				</UButton>
				<UButton
					size="sm"
					color="error"
					variant="soft"
					:disabled="isReadOnly || loading"
					@click="emit('delete')"
				>
					{{ $t('common.delete') }}
				</UButton>
				<UButton
					size="sm"
					color="success"
					:disabled="!canMarkDelivered || isReadOnly || loading"
					:loading="loading && canMarkDelivered"
					@click="emit('mark-delivered')"
				>
					{{ $t('components.shipment.markAsDelivered') }}
				</UButton>
			</div>
		</div>

		<div v-else class="space-y-3">
			<p class="text-sm text-muted">{{ $t('components.shipment.noShipment') }}</p>
			<UButton
				size="sm"
				color="primary"
				:disabled="isReadOnly || loading"
				@click="emit('create')"
			>
				{{ $t('components.shipment.createShipment') }}
			</UButton>
		</div>

		<p v-if="isReadOnly" class="mt-3 text-xs text-muted">
			{{ $t('components.shipment.readOnlyHint') }}
		</p>
	</UCard>
</template>
