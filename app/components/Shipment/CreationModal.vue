<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { failedNotification } from '~/stores/AppUi/AppUi';
import type { Courier } from '~/utils/types/courier';

type ShipmentFormState = {
	courier_id?: number;
	courier_name?: string;
	tracking_no: string;
};

const open = defineModel<boolean>('open', { default: false });

const props = withDefaults(
	defineProps<{
		couriers: Courier[];
		mode: 'create' | 'update';
		title?: string;
		submitLabel?: string;
		initialValue?: Partial<ShipmentFormState>;
		save: (payload: ShipmentFormState) => Promise<void>;
	}>(),
	{
		couriers: () => [],
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
	courier_id: undefined,
	courier_name: undefined,
	tracking_no: '',
});

const saving = ref(false);

const resetState = () => {
	state.courier_id = undefined;
	state.courier_name = undefined;
	state.tracking_no = '';
};

const applyInitialValue = () => {
	state.courier_id = props.initialValue?.courier_id;
	state.courier_name = props.initialValue?.courier_name;
	state.tracking_no = props.initialValue?.tracking_no ?? '';
};

const courierOptions = computed(() =>
	props.couriers.map((courier) => ({
		label: courier.name,
		value: courier.id,
		description: courier.description ?? undefined,
	})),
);

const selectedCourierOption = computed(() =>
	courierOptions.value.find((courier) => courier.value === state.courier_id),
);

watch(
	() => state.courier_id,
	(courierId) => {
		const selected = props.couriers.find((courier) => courier.id === courierId);
		state.courier_name = selected?.name;
	},
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
	if (event.data.courier_id == null) {
		failedNotification(t('components.shipment.courierName') + ' ' + t('common.required'));
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
				<UFormField :label="$t('components.shipment.courierName')">
					<USelectMenu
						v-model="state.courier_id"
						:items="courierOptions"
						value-key="value"
						class="w-full"
					>
						<template #default>
							<div v-if="selectedCourierOption" class="min-w-0 text-left">
								<p class="truncate text-sm font-medium text-default">{{ selectedCourierOption.label }}</p>
								<p v-if="selectedCourierOption.description" class="truncate text-xs text-muted">
									{{ selectedCourierOption.description }}
								</p>
							</div>
							<span v-else class="text-sm text-muted">{{ $t('components.shipment.courierName') }}</span>
						</template>

						<template #item="{ item }">
							<div class="min-w-0">
								<p class="truncate text-sm font-medium text-default">{{ item.label }}</p>
								<p v-if="item.description" class="truncate text-xs text-muted">{{ item.description }}</p>
							</div>
						</template>
					</USelectMenu>
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
