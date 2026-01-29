export const useCountryStore = defineStore('countryStore', {
	state: () => ({
		countries: [],
	}),
	actions: {
		async getCountries() {
			const { $api } = useNuxtApp();
			const data = await $api.country.getMany();
			this.countries = data.countries;
		},
	},
});
