<template>
	<UFormField name="status">
		<USelectMenu v-model="status" :items="options_sale_status" size="md" :ui="{ base: 'min-w-[150px]' }">
			<template #label>
				<span v-if="status">{{ capitalizeFirstLetter(status) }}</span>
				<span v-else class="text-neutral-400">Select Status</span>
			</template>

			<template #option="{ option }">
				<span class="truncate">{{ capitalizeFirstLetter(option) }}</span>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import { options_sale_status } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ status: string }>();
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
