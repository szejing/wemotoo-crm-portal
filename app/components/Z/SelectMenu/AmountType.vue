<template>
	<USelectMenu v-model="amountType" :items="items" size="md" :ui="{ base: 'min-w-[200px]' }">
		<template #default>
			<span v-if="amountType">{{ capitalizeFirstLetter(amountType) }}</span>
			<span v-else class="text-neutral-400">Select Amount Type</span>
		</template>

		<template #item="{ item }">
			<span class="truncate">{{ capitalizeFirstLetter(item) }}</span>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import type { AmountType } from 'wemotoo-common';
import { options_amount_type as items } from '~/utils/options';
import { capitalizeFirstLetter } from '~/utils/utils'; // Adjust the path as necessary

const props = defineProps<{ amountType: AmountType | undefined }>();
const emit = defineEmits(['update:amountType']);

const amountType = computed({
	get() {
		return props.amountType;
	},
	set(value) {
		emit('update:amountType', value);
	},
});
</script>

<style scoped></style>
