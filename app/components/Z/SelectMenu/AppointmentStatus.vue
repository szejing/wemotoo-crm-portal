<template>
	<USelectMenu v-model="status" :items="items" size="md" :ui="{ base: 'min-w-[150px]' }">
		<!-- <template #default>
			<span v-if="status">{{ capitalizeFirstLetter(status) }}</span>
			<span v-else class="text-neutral-400">Select Status</span>
		</template>

		<template #item="{ item }">
			<span class="truncate">{{ capitalizeFirstLetter(item) }}</span>
		</template> -->

		<template #default>
			<span v-if="status">
				<UBadge :color="getAppointmentStatusColor(status)" variant="subtle" class="truncate">
					{{ capitalizeFirstLetter(status) }}
				</UBadge>
			</span>
			<span v-else class="text-neutral-400">Select Appointment Status</span>
		</template>

		<template #item="{ item }">
			<UBadge :color="getAppointmentStatusColor(item)" variant="subtle" class="truncate">
				{{ capitalizeFirstLetter(item) }}
			</UBadge>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import type { AppointmentStatus } from 'wemotoo-common';
import { options_appointment_status as items, getAppointmentStatusColor } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ status: AppointmentStatus | undefined }>();
const emit = defineEmits(['update:status']);

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
