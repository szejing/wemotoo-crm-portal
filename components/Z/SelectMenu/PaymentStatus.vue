<template>
	<UFormField name="status">
		<USelectMenu v-model="status" :items="statusItems" value-key="label" size="md" :ui="{ base: 'min-w-[200px]' }">
			<template #default>
				<span v-if="status">{{ capitalizeFirstLetter(status) }}</span>
				<span v-else class="text-neutral-400">Select Payment Status</span>
			</template>

			<template #item="{ item }">
				<span class="truncate">{{ capitalizeFirstLetter(item.label) }}</span>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import { options_payment_status } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ paymentStatus: string }>();
const emit = defineEmits(['update:paymentStatus']);

const statusItems = computed(() => {
	return options_payment_status.map((status) => ({ label: status }));
});

const status = computed({
	get() {
		return props.paymentStatus;
	},
	set(value) {
		emit('update:paymentStatus', value);
	},
});
</script>

<style scoped></style>
