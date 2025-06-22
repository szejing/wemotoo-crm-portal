<template>
	<UFormGroup name="tags" class="mt-2">
		<USelectMenu v-model="taxes" v-model:query="query" :options="tax_options" searchable size="md" option-attribute="code" multiple by="code">
			<template #label>
				<span v-if="taxes.length" class="truncate">{{ taxes.map((tax: Tax) => tax.code).join(', ') }}</span>
				<span v-else class="text-gray-400">Select Taxes</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import type { Tax } from '~/utils/types/tax';

const query = ref('');
const taxStore = useTaxStore();
const { taxes: tax_options } = storeToRefs(taxStore);

const props = defineProps<{ taxes: Tax[] | undefined }>();

const emit = defineEmits(['update:taxes']);

onMounted(async () => {
	if (tax_options.value.length === 0) {
		await taxStore.getTaxes();
	}
});

const taxes = computed({
	get() {
		return props.taxes ?? [];
	},
	set(value) {
		emit('update:taxes', value);
	},
});
</script>

<style scoped lang="postcss"></style>
