<template>
	<div>
		<UForm :schema="CreateOutletValidation" :state="new_outlet" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputOutletGeneralInfo v-model:code="new_outlet.code" v-model:description="new_outlet.description" />
			<ZInputAddress
				v-model:address1="new_outlet.address1"
				v-model:address2="new_outlet.address2"
				v-model:address3="new_outlet.address3"
				v-model:city="new_outlet.city"
				v-model:postal-code="new_outlet.postal_code"
				v-model:state-name="new_outlet.state"
				v-model:country-code="new_outlet.country_code"
				v-model:longitude="new_outlet.longitude"
				v-model:latitude="new_outlet.latitude"
				required-lat-lng
			/>

			<div class="mt-4">
				<h6 class="text-secondary-700 text-sm font-bold">Tax Rule</h6>
				<ZSelectMenuTaxRule v-model:tax-rule="new_outlet.tax_rule" @update:tax-rule="updateTaxRule" />
			</div>

			<!-- *********************** General Info *********************** -->
			<div class="flex-center text-center mt-3">
				<UButton size="md" color="green" variant="solid" type="submit" block :loading="adding">Create</UButton>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { CreateOutletValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateOutletValidation>;

const outletStore = useOutletStore();
const { adding, new_outlet } = storeToRefs(outletStore);

onMounted(() => {
	outletStore.resetNewOutlet();
});

const updateTaxRule = (tax_rule: any) => {
	new_outlet.value.tax_rule = tax_rule.code;
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, description, address1, address2, address3, city, country_code, state, postal_code, longitude, latitude, tax_rule } = event.data;

	new_outlet.value = {
		code,
		description,
		address1,
		address2,
		address3,
		city,
		country_code,
		state,
		postal_code,
		longitude,
		latitude,
		tax_rule,
	};

	await outletStore.createOutlet();
};
</script>

<style scoped lang="postcss"></style>
