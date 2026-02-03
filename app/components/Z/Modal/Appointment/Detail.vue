<template>
	<UModal
		:title="$t('components.zModal.updateAppointment')"
		:ui="{
			content: 'w-full sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%]',
		}"
	>
		<template #header>
			<h2 class="text-main">{{ $t('components.zModal.appointment') }}</h2>
			<div class="mt-2">
				<h4 class="font-bold text-neutral-400">#{{ appointment!.code }}</h4>
				<h4 class="font-bold text-neutral-700">{{ $t('components.zModal.orderNo') }} #{{ appointment!.order_no }}</h4>
			</div>
		</template>

		<template #body>
			<UForm :schema="UpdateAppointmentValidation" :state="state.appointment" class="space-y-4" @submit="onSubmit">
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
						<h4 class="text-neutral-400 font-light">{{ $t('components.zModal.appointmentDate') }}</h4>
						<ZSelectMenuDateTime
							v-model:date-time="state.appointment.date_time"
							:placeholder="$t('components.zModal.appointmentDate')"
							:min-date="new Date()"
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
					<UButton color="primary" variant="solid" :loading="updating" type="submit">{{ $t('components.zModal.update') }}</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import type { AppointmentModel } from '~/utils/models';
import { UpdateAppointmentValidation } from '~/utils/schema';

type Schema = z.output<typeof UpdateAppointmentValidation>;

const props = defineProps({
	appointment: {
		type: Object as PropType<AppointmentModel> | undefined,
		required: true,
	},
});

const emit = defineEmits(['update', 'delete', 'cancel']);

const state = reactive({
	appointment: props.appointment,
});

const appointmentStore = useAppointmentStore();
const { updating } = storeToRefs(appointmentStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { date_time, ref_no, status } = event.data;

	console.log(date_time, ref_no, status);
	emit('update', { date_time, ref_no, status });
};

const onCancel = () => {
	emit('cancel');
};

const onDelete = () => {
	emit('delete');
};
</script>

<style scoped></style>
