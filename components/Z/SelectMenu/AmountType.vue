<template>
	<UFormGroup name="status">
		<USelectMenu v-model="status" :options="options_amount_type" size="md" :ui="{ base: 'min-w-[200px]' }">
			<template #label>
				<span v-if="status">{{ capitalizeFirstLetter(status) }}</span>
				<span v-else class="text-gray-400">Select Amount Type</span>
			</template>

			<template #option="{ option }">
				<span class="truncate">{{ capitalizeFirstLetter(option) }}</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import { options_amount_type } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ amountType: string | undefined }>();
const emit = defineEmits(['update:amountType']);

const status = computed({
	get() {
		return props.amountType;
	},
	set(value) {
		emit('update:amountType', value);
	},
});
</script>

<style scoped lang="postcss"></style>
