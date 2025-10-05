<template>
	<div class="space-y-4">
		<UFormGroup v-slot="{ error }" label="Address 1" name="address1" required>
			<UInput v-model="address1" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Address 1" />
		</UFormGroup>

		<UFormGroup label="Address 2" name="address2">
			<UInput v-model="address2" placeholder="Address 2" />
		</UFormGroup>

		<UFormGroup label="Address 3" name="address3">
			<UInput v-model="address3" placeholder="Address 3" />
		</UFormGroup>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<UFormGroup v-slot="{ error }" label="Postal Code" name="postal_code" required>
				<UInput v-model="postal_code" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Postal Code" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="City" name="city" required>
				<UInput v-model="city" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="City" />
			</UFormGroup>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<UFormGroup v-slot="{ error }" label="State" name="state_name" required>
				<UInput v-model="state_name" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="State" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Country Code" name="country_code" required>
				<UInput v-model="country_code" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Country Code" />
			</UFormGroup>
		</div>

		<div v-if="requiredLatLng" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<UFormGroup v-slot="{ error }" label="Longitude" name="longitude">
				<UInput v-model="longitude" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Longitude" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Latitude" name="latitude">
				<UInput v-model="latitude" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Latitude" />
			</UFormGroup>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { findPostcode } from 'malaysia-postcodes';

const props = defineProps<{
	address1?: string;
	address2?: string;
	address3?: string;
	city?: string;
	postalCode?: string;
	countryCode?: string;
	stateName?: string;
	requiredLatLng?: boolean;
	longitude?: number;
	latitude?: number;
}>();

const emit = defineEmits([
	'update:address1',
	'update:address2',
	'update:address3',
	'update:city',
	'update:postalCode',
	'update:countryCode',
	'update:stateName',
	'update:longitude',
	'update:latitude',
]);

const address1 = computed({
	get() {
		return props.address1;
	},
	set(value) {
		emit('update:address1', value);
	},
});

const address2 = computed({
	get() {
		return props.address2;
	},
	set(value) {
		emit('update:address2', value);
	},
});

const address3 = computed({
	get() {
		return props.address3;
	},
	set(value) {
		emit('update:address3', value);
	},
});

const city = computed({
	get() {
		return props.city;
	},
	set(value) {
		emit('update:city', value);
	},
});

const postal_code = computed({
	get() {
		return props.postalCode;
	},
	set(value) {
		const location = findPostcode(value ?? '');
		if (location) {
			emit('update:city', location.city);
			emit('update:stateName', location.state);
		}
		emit('update:postalCode', value);
	},
});

const state_name = computed({
	get() {
		return props.stateName;
	},
	set(value) {
		emit('update:stateName', value);
	},
});

const country_code = computed({
	get() {
		return props.countryCode;
	},
	set(value) {
		emit('update:countryCode', value);
	},
});

const longitude = computed({
	get() {
		return props.longitude;
	},
	set(value) {
		if (value != null || value != undefined) {
			emit('update:longitude', value);
		}
	},
});

const latitude = computed({
	get() {
		return props.latitude;
	},
	set(value) {
		if (value != null || value != undefined) {
			emit('update:latitude', value);
		}
	},
});
</script>

<style scoped lang="postcss"></style>
