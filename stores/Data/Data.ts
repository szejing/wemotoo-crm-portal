import type { Country } from '~/utils/types/country';

export const useDataStore = defineStore('dataStore', {
	state: () => ({
		countries: [] as Country[],
	}),
	actions: {
		async getCountries() {
			const { $api } = useNuxtApp();
			const countries = await $api.data.getCountries();
			this.countries = countries.countries;
		},
	},
});
