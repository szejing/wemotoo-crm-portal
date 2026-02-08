<template>
	<USelectMenu
		v-model="country?.iso2"
		v-model:search-term="searchTerm"
		:items="countryItems"
		:search-input="{}"
		size="md"
		:placeholder="$t('components.selectMenu.selectCountry')"
		value-key="iso2"
	/>
</template>

<script lang="ts" setup>
import { useDataStore } from '~/stores/Data/Data';
import type { Country } from '~/utils/types/country';

const searchTerm = ref('');
const dataStore = useDataStore();
const { countries } = storeToRefs(dataStore);

const props = defineProps<{ country: Country | undefined }>();

const countryItems = computed(() => {
	return dataStore.countries.map((country) => ({
		...country,
		label: country.iso2,
	}));
});
const emit = defineEmits(['update:country']);

const country = computed({
	get() {
		return props.country ?? undefined;
	},
	set(value) {
		emit('update:country', JSON.parse(JSON.stringify(value)));
	},
});
</script>

<style scoped></style>
