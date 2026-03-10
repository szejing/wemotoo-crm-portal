<template>
	<UModal
		:default-open="true"
		:title="$t('components.zModal.updateAppointment')"
		:ui="{
			content: 'w-full sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%]',
		}"
	>
		<template #header>
			<h2 class="text-main">{{ $t('components.zModal.appointment') }}</h2>
			<div class="mt-2">
				<h4 class="font-bold text-neutral-400">#{{ appointment!.code }}</h4>
				<h4 v-if="appointment!.order_no" class="font-bold text-neutral-700">{{ $t('components.zModal.orderNo') }} #{{ appointment!.order_no }}</h4>
			</div>
		</template>

		<template #body>
			<UForm ref="formRef" :schema="appointmentSchema" :state="state.appointment" class="space-y-4" @submit="onSubmit">
				<div class="flex flex-col gap-4">
					<div class="flex-jbetween-icenter">
						<div>
							<div class="flex flex-col gap-1">
								<h4 class="text-neutral-700 font-bold">
									{{ appointment!.customer_name }} <br />
									{{ appointment!.customer_phone }}
								</h4>
							</div>
						</div>
						<ZSelectMenuAppointmentStatus v-model:status="state.appointment.status" />
					</div>

					<div class="flex flex-col gap-2">
						<h4 class="text-neutral-400 font-light">{{ $t('components.zModal.appointmentStartDate') }}</h4>
						<ZSelectMenuDateTime
							v-model:date-time="state.appointment.start_date_time"
							:placeholder="$t('components.zModal.appointmentStartDate')"
							:min-date="new Date()"
							:max-date="new Date(new Date().setMonth(new Date().getMonth() + 2))"
						/>
					</div>
					<div class="flex flex-col gap-2">
						<h4 class="text-neutral-400 font-light">{{ $t('components.zModal.appointmentEndDate') }}</h4>
						<ZSelectMenuDateTime
							v-model:date-time="state.appointment.end_date_time"
							:placeholder="$t('components.zModal.appointmentEndDate')"
							:min-date="state.appointment.start_date_time ?? new Date()"
							:max-date="new Date(new Date().setMonth(new Date().getMonth() + 2))"
						/>
					</div>
				</div>
			</UForm>
		</template>

		<template #footer>
			<div class="flex-jbetween-icenter w-full">
				<UButton color="error" variant="ghost" class="opacity-50 hover:opacity-100" @click="onDelete">{{ $t('components.zModal.delete') }}</UButton>

				<div class="flex-jend gap-4">
					<UButton color="neutral" variant="soft" @click="onCancel">{{ $t('common.cancel') }}</UButton>
					<UButton color="primary" variant="solid" :loading="updating" @click="formRef?.submit()">{{ $t('components.zModal.update') }}</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { UpdateAppointmentValidation } from '~/utils/schema';
import type { Appointment } from '~/utils/types/appointment';

const { t } = useI18n();
const appointmentSchema = computed(() => UpdateAppointmentValidation(t));

type Schema = z.infer<ReturnType<typeof UpdateAppointmentValidation>>;

const DEFAULT_DURATION_MS = 60 * 60 * 1000; // 1 hour

const toDate = (value: Date | string | undefined): Date | undefined => {
	if (value == null) return undefined;
	return value instanceof Date ? value : new Date(value as string);
};

const getTimeSafe = (value: Date | string | undefined): number | undefined => {
	const d = toDate(value);
	return d != null && !Number.isNaN(d.getTime()) ? d.getTime() : undefined;
};

const props = defineProps({
	appointment: {
		type: Object as PropType<Appointment> | undefined,
		required: true,
	},
});

const emit = defineEmits(['update', 'delete', 'cancel']);

const state = reactive({
	appointment: (() => {
		const a = { ...props.appointment };
		if (!a.end_date_time && a.start_date_time) {
			const start = toDate(a.start_date_time)!;
			a.end_date_time = new Date(start.getTime() + DEFAULT_DURATION_MS);
		}
		return a;
	})(),
});

// Duration in ms; when start changes, end is set to start + durationMs
const initialDuration = (() => {
	const start = getTimeSafe(state.appointment.start_date_time);
	const end = getTimeSafe(state.appointment.end_date_time);
	if (start != null && end != null && end >= start) return end - start;
	return DEFAULT_DURATION_MS;
})();
const durationMs = ref<number>(initialDuration);

watch(
	() => state.appointment.start_date_time,
	(newStart) => {
		const startTime = getTimeSafe(newStart);
		if (startTime == null || durationMs.value <= 0) return;
		state.appointment.end_date_time = new Date(startTime + durationMs.value);
	},
);

watch(
	() => state.appointment.end_date_time,
	(newEnd) => {
		const startTime = getTimeSafe(state.appointment.start_date_time);
		const endTime = getTimeSafe(newEnd);
		if (startTime != null && endTime != null && endTime >= startTime) {
			durationMs.value = endTime - startTime;
		}
	},
);

const formRef = ref<{ submit: () => void } | null>(null);
const appointmentStore = useAppointmentStore();
const { updating } = storeToRefs(appointmentStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { start_date_time, end_date_time, ref_no, status } = event.data;
	const end = end_date_time ?? start_date_time;

	emit('update', { ...props.appointment, start_date_time, end_date_time: end, ref_no, status });
};

const onCancel = () => {
	emit('cancel');
};

const onDelete = () => {
	emit('delete');
};
</script>

<style scoped></style>
