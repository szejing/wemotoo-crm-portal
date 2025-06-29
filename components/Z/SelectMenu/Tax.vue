<template>
	<UFormGroup name="tags" class="mt-2">
		<USelectMenu v-model="tax" v-model:query="query" :options="tax_options" searchable size="md" option-attribute="code" by="code">
			<template #label>
				<span v-if="tax" class="truncate">{{ tax.code }}</span>
				<span v-else class="text-gray-400">Select Tax Code</span>
			</template>
		</USelectMenu>
	</UFormGroup>
</template>

<script lang="ts" setup>
import type { Tax } from '~/utils/types/tax';

const query = ref('');
const taxStore = useTaxStore();
const { taxes: tax_options } = storeToRefs(taxStore);

const props = defineProps<{ tax: Tax | string | undefined }>();

const emit = defineEmits(['update:tax']);

onMounted(async () => {
	if (tax_options.value.length === 0) {
		await taxStore.getTaxes();
	}
});

const tax = computed({
	get() {
		if (typeof props.tax === 'string') {
			return tax_options.value.find((tax) => tax.code === props.tax);
		}

		return props.tax ?? undefined;
	},
	set(value) {
		emit('update:tax', value);
	},
});
</script>

<style scoped lang="postcss"></style>
