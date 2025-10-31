<template>
	<UFormField name="brands" class="mt-2">
		<USelectMenu v-model="brands" v-model:search-term="searchTerm" :items="brandItems" :search-input="{}" size="md" value-key="code" multiple>
			<template #default>
				<span v-if="brands.length" class="truncate">{{ brands.map((brand) => brand.code).join(', ') }}</span>
				<span v-else class="text-neutral-400">Select Brands</span>
			</template>

			<template #empty>
				<UButton color="success" variant="ghost">Create "{{ searchTerm }}"</UButton>
			</template>
		</USelectMenu>
	</UFormField>
</template>

<script lang="ts" setup>
import type { Brand, BrandInput } from '~/utils/types/brand';

const searchTerm = ref('');
const brandStore = useBrandStore();
const { brands: brand_options } = storeToRefs(brandStore);

const brandItems = computed(() => {
	return brand_options.value.map((brand) => ({
		...brand,
		label: brand.code,
	}));
});

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

<style scoped></style>
