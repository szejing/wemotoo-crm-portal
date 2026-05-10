<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { failedNotification } from '~/stores/AppUi/AppUi';
import type { ShippingMethodOption } from '~/utils/types/order-fulfillment-shipping';

type ShipmentFormState = {
	shipping_method_id?: number;
	courier_name: string;
	tracking_no: string;
};

const open = defineModel<boolean>('open', { default: false });

const props = withDefaults(
	defineProps<{
		methods: ShippingMethodOption[];
		mode: 'create' | 'update';
		title?: string;
		submitLabel?: string;
		initialValue?: Partial<ShipmentFormState>;
		save: (payload: ShipmentFormState) => Promise<void>;
	}>(),
	{
		methods: () => [],
		title: undefined,
		submitLabel: undefined,
		initialValue: undefined,
	},
);

const emit = defineEmits<{
	'after:leave': [];
	close: [value?: boolean];
}>();

const { t } = useI18n();

const state = reactive<ShipmentFormState>({
	shipping_method_id: undefined,
	courier_name: '',
	tracking_no: '',
});

const saving = ref(false);

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

onMounted(() => {
	if (open.value) {
		applyInitialValue();
	}
});

watch(open, (isOpen) => {
	if (isOpen) {
		applyInitialValue();
	} else {
		resetState();
	}
});

const onSubmit = async (event: FormSubmitEvent<ShipmentFormState>) => {
	if (props.mode === 'create' && event.data.shipping_method_id == null) {
		failedNotification(t('components.shipment.shippingMethod') + ' ' + t('common.required'));
		return;
	}

	saving.value = true;
	try {
		await props.save(event.data);
		emit('close', true);
	} catch {
		// Keep modal open; store/toast handles errors.
	} finally {
		saving.value = false;
	}
};
</script>

<template>
	<UModal
		v-model:open="open"
		:title="title ?? $t('components.shipment.createShipment')"
		:ui="{ content: 'w-full sm:max-w-xl' }"
		@after:leave="emit('after:leave')"
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
					<UButton type="button" color="neutral" variant="ghost" @click="emit('close', false)">
						{{ $t('common.cancel') }}
					</UButton>
					<UButton type="submit" color="primary" :loading="saving">
						{{ submitLabel ?? $t('common.submit') }}
					</UButton>
				</div>
			</UForm>
		</template>
	</UModal>
</template>
