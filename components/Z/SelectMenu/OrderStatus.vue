<template>
	<UFormGroup name="status">
		<USelectMenu v-model="status" :options="statuses" size="md" :ui="{ base: 'min-w-[150px]' }">
			<template #label>
				<span v-if="status">{{ capitalizeFirstLetter(status) }}</span>
				<span v-else class="text-gray-400">Select Order Status</span>
			</template>

			<template #option="{ option }">
				<span class="truncate">{{ capitalizeFirstLetter(option) }}</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import { OrderStatus } from 'wemotoo-common';
import { options_order_status } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ status: string }>();
const emit = defineEmits(['update:status']);

const statuses = computed(() => {
	return options_order_status.filter((status) => status !== OrderStatus.REQUIRES_ACTION && status !== OrderStatus.REFUNDED);
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

<style scoped lang="postcss"></style>
