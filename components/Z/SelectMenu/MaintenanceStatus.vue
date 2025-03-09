<template>
	<UFormGroup name="status">
		<USelectMenu v-model="status" :options="options_maintenance_status" size="md">
			<template #label>
				<span v-if="status">{{ capitalizeFirstLetter(status) }}</span>
				<span v-else class="text-gray-400">Select Maintenance Status</span>
			</template>

			<template #option="{ option }">
				<span class="truncate">{{ capitalizeFirstLetter(option) }}</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import type { MaintenanceStatus } from '~/utils/enum/maintenance-status';
import { options_maintenance_status } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ status: MaintenanceStatus | undefined }>();
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

<style scoped lang="css"></style>
