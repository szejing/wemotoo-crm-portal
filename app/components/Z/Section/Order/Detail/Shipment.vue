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

		<div v-if="shippingMethodLabel" class="customer-shipping-selection">
			<span class="customer-shipping-selection-label">{{ $t('components.shipment.customerSelection') }}</span>
			<UBadge color="neutral" variant="subtle" size="md">
				{{ shippingMethodLabel }}
			</UBadge>
		</div>

		<div v-if="shipment" class="space-y-3 text-sm">
			<p>{{ $t('components.shipment.courierName') }}: {{ shipment.courier_name }}</p>
			<p>{{ $t('components.shipment.trackingNo') }}: {{ shipment.tracking_no }}</p>
			<p>{{ $t('components.shipment.shippingFee') }}: {{ shipment.shipping_fee }}</p>

			<div class="flex flex-wrap gap-2">
				<UButton size="sm" color="neutral" variant="soft" :disabled="isReadOnly || loading" @click="openEditShipmentModal">
					{{ $t('common.edit') }}
				</UButton>
				<UButton size="sm" color="error" variant="soft" :disabled="isReadOnly || loading" @click="handleDeleteShipment">
					{{ $t('common.delete') }}
				</UButton>
				<UButton
					size="sm"
					color="success"
					:disabled="!canMarkDelivered || isReadOnly || loading"
					:loading="loading && canMarkDelivered"
					@click="handleMarkDelivered"
				>
					{{ $t('components.shipment.markAsDelivered') }}
				</UButton>
			</div>
		</div>

		<div v-else class="payment-empty">
			<UIcon name="i-heroicons-truck" class="w-12 h-12 text-neutral-300" />
			<p class="payment-empty-text">{{ $t('components.shipment.noShipment') }}</p>
			<UButton size="sm" color="primary" :icon="ICONS.ADD_OUTLINE" :disabled="isReadOnly || loading" @click="openCreateShipmentModal">
				{{ $t('components.shipment.createShipment') }}
			</UButton>
		</div>

		<p v-if="isReadOnly" class="mt-3 text-xs text-muted">
			{{ $t('components.shipment.readOnlyHint') }}
		</p>
	</UCard>
</template>

<script lang="ts" setup>
import { LazyShipmentCreationModal, ZModalConfirmation } from '#components';
import { ICONS } from '~/utils/icons';
import { getShipmentStatusColor } from '~/utils/options';
import { useShipmentStore } from '~/stores/Shipment/Shipment';
import type { OrderHistory } from '~/utils/types/order-history';
import type { ShippingMethodOption } from '~/utils/types/order-fulfillment-shipping';

const props = defineProps<{
	order?: OrderHistory;
	isReadOnly?: boolean;
}>();

const emit = defineEmits<{
	refresh: [];
}>();

const { t } = useI18n();
const overlay = useOverlay();
const shipmentStore = useShipmentStore();

const shipment = computed(() => props.order?.shipment);

const shippingMethodLabel = computed(() => {
	const o = props.order;
	if (!o) return '';
	return o.shipping_method?.description ?? `#${o.shipping_method_id}`;
});

const loading = computed(() => shipmentStore.creating || shipmentStore.updating || shipmentStore.removing);

const shipmentModalMethods = ref<ShippingMethodOption[]>([]);

const loadShipmentMethodsForModal = async () => {
	// const addr = customer.value?.shipping_address;
	// if (addr?.country_code) {
	// 	try {
	// 		shipmentModalMethods.value = await shippingStore.fetchAllShippingMethods({
	// 			country_code: addr.country_code,
	// 			state: addr.state,
	// 			postal_code: addr.postal_code,
	// 		});
	// 	} catch {
	// 		shipmentModalMethods.value = await shippingStore.fetchAllShippingMethods();
	// 	}
	// } else {
	// 	shipmentModalMethods.value = await shippingStore.fetchAllShippingMethods();
	// }
};

const statusLabel = computed(() => {
	if (!shipment.value) {
		return 'options.pending';
	}

	const labels: Record<string, string> = {
		pending: 'options.pending',
		shipped: 'options.shipped',
		in_transit: 'options.inTransit',
		delivered: 'options.delivered',
		failed: 'options.failed',
	};

	return labels[shipment.value.status] ?? 'options.pending';
});

const canMarkDelivered = computed(() => {
	return shipment.value?.status === 'shipped' || shipment.value?.status === 'in_transit';
});

const openCreateShipmentModal = async () => {
	if (props.isReadOnly || !props.order) {
		return;
	}

	await loadShipmentMethodsForModal();

	const rec = props.order;
	const shipmentModal = overlay.create(LazyShipmentCreationModal, {
		props: {
			open: true,
			methods: shipmentModalMethods.value,
			mode: 'create' as const,
			title: t('components.shipment.createShipment'),
			submitLabel: t('common.create'),
			initialValue: {
				shipping_method_id: undefined,
				courier_name: '',
				tracking_no: '',
			},
			save: async (payload) => {
				await shipmentStore.createShipment({
					order_no: rec.order_no,
					inv_no: rec.inv_no,
					shipping_method_id: Number(payload.shipping_method_id),
					courier_name: payload.courier_name,
					tracking_no: payload.tracking_no,
				});
			},
		},
	});

	const instance = shipmentModal.open();
	const saved = await instance.result;
	if (saved) {
		emit('refresh');
	}
};

const openEditShipmentModal = async () => {
	if (!props.order?.shipment || props.isReadOnly) {
		return;
	}

	await loadShipmentMethodsForModal();

	const rec = props.order;
	const ship = rec.shipment!;
	const shipmentId = ship.id;

	const shipmentModal = overlay.create(LazyShipmentCreationModal, {
		props: {
			open: true,
			methods: shipmentModalMethods.value,
			mode: 'update' as const,
			title: t('components.shipment.updateShipment'),
			submitLabel: t('common.save'),
			initialValue: {
				shipping_method_id: undefined,
				courier_name: ship.courier_name,
				tracking_no: ship.tracking_no,
			},
			save: async (payload) => {
				await shipmentStore.updateShipment(shipmentId, {
					shipping_method_id: payload.shipping_method_id,
					courier_name: payload.courier_name,
					tracking_no: payload.tracking_no,
				});
			},
		},
	});

	const instance = shipmentModal.open();
	const saved = await instance.result;
	if (saved) {
		emit('refresh');
	}
};

const handleDeleteShipment = async () => {
	if (!props.order?.shipment?.id || props.isReadOnly) {
		return;
	}

	const shipmentId = props.order.shipment.id;

	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: t('components.shipment.confirmDelete'),
			action: 'delete',
			onConfirm: async () => {
				await shipmentStore.deleteShipment(shipmentId);
				confirmModal.close();
				emit('refresh');
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const handleMarkDelivered = async () => {
	if (!props.order?.shipment?.id || props.isReadOnly) {
		return;
	}

	await shipmentStore.markDelivered(props.order.shipment.id);
	emit('refresh');
};
</script>

<style scoped>
.customer-shipping-selection {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 0.75rem;
}

.customer-shipping-selection-label {
	font-size: 0.75rem;
	font-weight: 500;
	color: var(--color-gray-500);
	text-transform: uppercase;
	letter-spacing: 0.02em;
}

.payment-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	text-align: center;
	gap: 1rem;
}

.payment-empty-text {
	color: var(--color-gray-500);
	font-size: 0.875rem;
}
</style>
