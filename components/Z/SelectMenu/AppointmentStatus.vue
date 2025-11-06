<template>
	<USelectMenu v-model="status" :items="items" size="md" :ui="{ base: 'min-w-[150px]' }">
		<template #default>
			<span v-if="status">{{ capitalizeFirstLetter(status) }}</span>
			<span v-else class="text-neutral-400">Select Status</span>
		</template>

		<template #item="{ item }">
			<span class="truncate">{{ capitalizeFirstLetter(item) }}</span>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import type { AppointmentStatus } from 'wemotoo-common';
import { options_appointment_status as items } from '~/utils/options';
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
