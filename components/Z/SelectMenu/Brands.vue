<template>
	<USelectMenu
		v-model="brands"
		v-model:search-term="searchTerm"
		:items="items"
		:search-input="{}"
		size="md"
		multiple
		label-key="code"
		description-key="description"
		placeholder="Select Brands"
	>
		<template #default>
			<div v-if="brands && brands.length > 0" class="flex flex-wrap gap-1.5">
				<div
					v-for="brand in brands"
					:key="brand.code"
					class="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1"
				>
					<p class="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{{ brand.code }}</p>
					<UIcon
						:name="ICONS.CROSS"
						class="w-4 h-4 shrink-0 text-error-500 dark:text-error-400 hover:text-error-600 dark:hover:text-error-300 transition-colors ml-2 cursor-pointer"
						@click.stop="remove(brand)"
					/>
				</div>
			</div>
			<span v-else class="text-neutral-400 text-sm">Select Brands</span>
		</template>

		<template #empty>
			<UButton color="success" variant="ghost">Create "{{ searchTerm }}"</UButton>
		</template>
	</USelectMenu>
</template>

<script lang="ts" setup>
import type { Brand } from '~/utils/types/brand';

const searchTerm = ref('');
const brandStore = useBrandStore();
const { brands: items } = storeToRefs(brandStore);

const props = defineProps<{ brands: Brand[] | undefined }>();

const emit = defineEmits(['update:brands']);

const brands = computed<Brand[]>({
	get() {
		return props.brands ?? [];
	},
	set(value) {
		emit('update:brands', JSON.parse(JSON.stringify(value)));
	},
});

const remove = (brand: Brand) => {
	brands.value = brands.value.filter((b) => b.code !== brand.code);
};
</script>

<style scoped></style>
