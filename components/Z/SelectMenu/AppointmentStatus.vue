<template>
	<UFormField name="status">
		<USelectMenu v-model="status" :items="statusItems" value-key="label" size="md" :ui="{ base: 'min-w-[150px]' }">
			<template #default>
				<span v-if="status">{{ capitalizeFirstLetter(status) }}</span>
				<span v-else class="text-neutral-400">Select Status</span>
			</template>

			<template #item="{ item }">
				<span class="truncate">{{ capitalizeFirstLetter(item.label) }}</span>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import { options_appointment_status } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ status: string | undefined }>();
const emit = defineEmits(['update:status']);

const statusItems = computed(() => {
	return options_appointment_status.map((status) => ({ label: status }));
});

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
