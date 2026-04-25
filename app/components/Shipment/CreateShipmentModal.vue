<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import type { ShippingMethodOption } from '~/utils/types/order-fulfillment-shipping';

type ShipmentFormState = {
	shipping_method_id?: number;
	courier_name: string;
	tracking_no: string;
};

const props = withDefaults(
	defineProps<{
		open: boolean;
		methods: ShippingMethodOption[];
		loading?: boolean;
		title?: string;
		submitLabel?: string;
		initialValue?: Partial<ShipmentFormState>;
	}>(),
	{
		methods: () => [],
		title: undefined,
		submitLabel: undefined,
		initialValue: undefined,
	},
);

const emit = defineEmits<{
	(e: 'update:open', value: boolean): void;
	(e: 'submit', payload: ShipmentFormState): void;
}>();

const state = reactive<ShipmentFormState>({
	shipping_method_id: undefined,
	courier_name: '',
	tracking_no: '',
});

const resetState = () => {
	state.shipping_method_id = undefined;
	state.courier_name = '';
	state.tracking_no = '';
};

const applyInitialValue = () => {
	state.shipping_method_id = props.initialValue?.shipping_method_id;
	state.courier_name = props.initialValue?.courier_name ?? '';
	state.tracking_no = props.initialValue?.tracking_no ?? '';
};

const methodOptions = computed(() =>
	props.methods.map((method) => ({
		label:
			method.fee != null && !Number.isNaN(Number(method.fee))
				? `${method.description} (${method.fee})`
				: method.description,
		value: method.id,
	})),
);

watch(
	() => props.open,
	(isOpen) => {
		if (isOpen) {
			applyInitialValue();
		} else {
			resetState();
		}
	},
);

const onSubmit = (event: FormSubmitEvent<ShipmentFormState>) => {
	emit('submit', event.data);
};
</script>

<template>
	<UModal
		:open="open"
		:title="title ?? $t('components.shipment.createShipment')"
		:ui="{ content: 'w-full sm:max-w-xl' }"
		@update:open="emit('update:open', $event)"
	>
		<template #body>
			<UForm :state="state" class="space-y-4" @submit="onSubmit">
				<UFormField :label="$t('components.shipment.shippingMethod')">
					<USelectMenu
						v-model="state.shipping_method_id"
						:items="methodOptions"
						value-key="value"
					/>
				</UFormField>

				<UFormField :label="$t('components.shipment.courierName')">
					<UInput v-model="state.courier_name" />
				</UFormField>

				<UFormField :label="$t('components.shipment.trackingNo')">
					<UInput v-model="state.tracking_no" />
				</UFormField>

				<div class="flex justify-end gap-2">
					<UButton
						type="button"
						color="neutral"
						variant="ghost"
						@click="emit('update:open', false)"
					>
						{{ $t('common.cancel') }}
					</UButton>
					<UButton type="submit" color="primary" :loading="loading">
						{{ submitLabel ?? $t('common.submit') }}
					</UButton>
				</div>
			</UForm>
		</template>
	</UModal>
</template>
