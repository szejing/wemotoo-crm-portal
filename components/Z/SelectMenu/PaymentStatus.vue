<template>
	<UFormGroup name="status">
		<USelectMenu v-model="status" :options="options_payment_status" size="md">
			<template #label>
				<span v-if="status">{{ capitalizeFirstLetter(status) }}</span>
				<span v-else class="text-gray-400">Select Payment Status</span>
			</template>

			<template #option="{ option }">
				<span class="truncate">{{ capitalizeFirstLetter(option) }}</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import { options_payment_status } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ paymentStatus: string }>();
const emit = defineEmits(['update:paymentStatus']);

const status = computed({
	get() {
		console.log(props.paymentStatus);
		return props.paymentStatus;
	},
	set(value) {
		emit('update:paymentStatus', value);
	},
});
</script>

<style scoped lang="postcss"></style>
