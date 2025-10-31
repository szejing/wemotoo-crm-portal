<template>
	<UFormField name="tags" class="mt-2">
		<USelectMenu v-model="tax" v-model:search-term="searchTerm" :items="taxItems" :search-input="{}" size="md" value-key="code">
			<template #default>
				<span v-if="tax" class="truncate">{{ tax.code }}</span>
				<span v-else class="text-neutral-400">Select Tax Code</span>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import type { Tax } from '~/utils/types/tax';

const searchTerm = ref('');
const taxStore = useTaxStore();
const { taxes: tax_options } = storeToRefs(taxStore);

const taxItems = computed(() => {
	return tax_options.value.map((tax) => ({
		...tax,
		label: tax.code,
	}));
});

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

<style scoped></style>
