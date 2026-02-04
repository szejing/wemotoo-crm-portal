<template>
	<USelectMenu
		v-model="country"
		v-model:search-term="searchTerm"
		:items="countryItems"
		:search-input="{}"
		size="md"
		:placeholder="$t('components.selectMenu.selectCountry')"
		value-key="code"
	/>
</template>

<script lang="ts" setup>
import type { Country } from '~/utils/types/country';

const searchTerm = ref('');
const countryStore = useCountryStore();
const { countries } = storeToRefs(countryStore);

const props = defineProps<{ country: Country | undefined }>();

const countryItems = computed(() => {
	return countries.value.map((country) => ({
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
