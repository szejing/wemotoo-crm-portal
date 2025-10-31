<template>
	<UFormField name="status">
		<USelectMenu v-model="status" :items="statusItems" value-key="label" size="md" :ui="{ base: 'min-w-[200px]' }">
			<template #default>
				<span v-if="status">{{ capitalizeFirstLetter(status) }}</span>
				<span v-else class="text-neutral-400">Select Amount Type</span>
			</template>

			<template #item="{ item }">
				<span class="truncate">{{ capitalizeFirstLetter(item.label) }}</span>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import { options_amount_type } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ amountType: string | undefined }>();
const emit = defineEmits(['update:amountType']);

const statusItems = computed(() => {
	return options_amount_type.map((status) => ({ label: status }));
});

const status = computed({
	get() {
		return props.amountType;
	},
	set(value) {
		emit('update:amountType', value);
	},
});
</script>

<style scoped></style>
