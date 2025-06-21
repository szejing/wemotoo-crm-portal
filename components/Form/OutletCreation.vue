<template>
	<div>
		<UForm :schema="CreateOutletValidation" :state="newOutlet" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputOutletGeneralInfo v-model:code="newOutlet.code" v-model:description="newOutlet.description" />
			<ZInputAddress
				v-model:address1="newOutlet.address1"
				v-model:address2="newOutlet.address2"
				v-model:address3="newOutlet.address3"
				v-model:city="newOutlet.city"
				v-model:postal-code="newOutlet.postal_code"
				v-model:state-name="newOutlet.state"
				v-model:country-code="newOutlet.country_code"
				v-model:longitude="newOutlet.longitude"
				v-model:latitude="newOutlet.latitude"
				required-lat-lng
			/>
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
const { adding, newOutlet } = storeToRefs(outletStore);

onMounted(() => {
	outletStore.resetNewOutlet();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, description, address1, address2, address3, city, country_code, state, postal_code, longitude, latitude } = event.data;
	console.log(code, description, address1, address2, address3, city, country_code, state, postal_code, longitude, latitude);
	await outletStore.createOutlet({ code, description, address1, address2, address3, city, country_code, state, postal_code, longitude, latitude });
};
</script>

<style scoped lang="postcss"></style>
