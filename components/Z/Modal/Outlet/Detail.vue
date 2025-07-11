<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[60%] md:w-[40%] lg:w-[30%]',
		}"
	>
		<UForm :schema="UpdateOutletValidation" :state="state.outlet" class="space-y-4" @submit="onSubmit">
			<UCard>
				<template #header><h3>Update Outlet</h3></template>
				<!-- *********************** General Info *********************** -->

				<!-- *********************** General Info *********************** -->
				<ZInputOutletGeneralInfo v-model:code="state.outlet.code" v-model:description="state.outlet.description" is-update />
				<ZInputAddress
					v-model:address1="state.outlet.address1"
					v-model:address2="state.outlet.address2"
					v-model:address3="state.outlet.address3"
					v-model:city="state.outlet.city"
					v-model:postal-code="state.outlet.postal_code"
					v-model:state-name="state.outlet.state"
					v-model:country-code="state.outlet.country_code"
					v-model:longitude="state.outlet.longitude"
					v-model:latitude="state.outlet.latitude"
					required-lat-lng
					class="mt-4"
				/>
				<!-- *********************** General Info *********************** -->
				<div class="mt-4">
					<h6 class="text-secondary-700 text-sm font-bold">Tax Rule</h6>
					<ZSelectMenuTaxRule v-model:tax-rule="state.outlet.tax_rule" @update:tax-rule="updateTaxRule" />
				</div>

				<!-- *********************** General Info *********************** -->

				<template #footer>
					<div class="flex-jbetween-icenter">
						<UButton color="danger" variant="ghost" @click="onDelete">Delete</UButton>

						<div class="flex-jend gap-4">
							<UButton color="neutral" variant="soft" @click="onCancel">Cancel</UButton>
							<UButton color="primary" variant="solid" :loading="updating" type="submit">Update</UButton>
						</div>
					</div>
				</template>
			</UCard>
		</UForm>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { UpdateOutletValidation } from '~/utils/schema';
import type { Outlet } from '~/utils/types/outlet';

type Schema = z.output<typeof UpdateOutletValidation>;

const props = defineProps({
	outlet: {
		type: Object as PropType<Outlet> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'delete', 'cancel']);

const state = reactive({
	outlet: {
		code: props.outlet.code,
		description: props.outlet.description,
		address1: props.outlet.address1,
		address2: props.outlet.address2,
		address3: props.outlet.address3,
		city: props.outlet.city,
		country_code: props.outlet.country_code,
		state: props.outlet.state,
		postal_code: props.outlet.postal_code,
		longitude: props.outlet.longitude,
		latitude: props.outlet.latitude,
		tax_rule: props.outlet.tax_rule,
	},
});

const tagStore = useProductTagStore();
const { updating } = storeToRefs(tagStore);

const updateTaxRule = (tax_rule: any) => {
	state.outlet.tax_rule = tax_rule.code;
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { description, address1, address2, address3, city, country_code, state, postal_code, longitude, latitude, tax_rule } = event.data;

	emit('update', { description, address1, address2, address3, city, country_code, state, postal_code, longitude, latitude, tax_rule });
};

const onDelete = () => {
	emit('delete');
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style scoped lang="postcss"></style>
