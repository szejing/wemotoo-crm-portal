<template>
	<UFormField name="brands" class="mt-2">
		<USelectMenu v-model="brands" v-model:query="query" :items="brand_options" searchable size="md" option-attribute="code" multiple by="code">
			<template #label>
				<span v-if="brands.length" class="truncate">{{ brands.map((brand) => brand.code).join(', ') }}</span>
				<span v-else class="text-neutral-400">Select Brands</span>
			</template>

			<template #option-empty>
				<UButton color="success" variant="ghost">Create "{{ query }}"</UButton>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import type { Brand, BrandInput } from '~/utils/types/brand';

const query = ref('');
const brandStore = useBrandStore();
const { brands: brand_options } = storeToRefs(brandStore);

const props = defineProps<{ brands: Brand[] | BrandInput[] | undefined }>();

const emit = defineEmits(['update:brands']);

const brands = computed({
	get() {
		return props.brands ?? [];
	},
	set(value) {
		emit('update:brands', JSON.parse(JSON.stringify(value)));
	},
});
</script>

<style scoped lang="postcss"></style>
