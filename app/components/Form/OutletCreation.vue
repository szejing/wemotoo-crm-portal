<template>
	<UForm :schema="CreateOutletValidation" :state="new_outlet" class="space-y-6" @submit="onSubmit">
		<div class="space-y-6">
			<!-- General Information Section -->
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<UIcon :name="ICONS.OUTLET" class="w-5 h-5 text-primary-500" />
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('components.productForm.generalInformation') }}</h3>
				</div>
				<div class="pl-7">
					<ZInputOutletGeneralInfo v-model:code="new_outlet.code" v-model:description="new_outlet.description" />
				</div>
			</div>

			<!-- Address Section -->
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-primary-500" />
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('components.outletForm.addressAndLocation') }}</h3>
				</div>
				<div class="pl-7">
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
				</div>
			</div>

			<!-- Tax Rule Section -->
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<UIcon :name="ICONS.TAX" class="w-5 h-5 text-primary-500" />
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('components.outletForm.taxConfiguration') }}</h3>
				</div>
				<div class="pl-7">
					<ZSelectMenuTaxRule v-model:tax-rule="new_outlet.tax_rule_code" class="sm:w-[50%] w-full" @update:tax-rule="updateTaxRule" />
				</div>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-8">
			<UButton color="success" size="lg" type="submit" :loading="adding" class="w-full sm:w-auto sm:min-w-[200px]">
				<UIcon :name="ICONS.CHECK_ROUNDED" class="w-5 h-5" />
				<span>{{ $t('components.outletForm.createOutlet') }}</span>
			</UButton>
		</div>
	</UForm>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { CreateOutletValidation } from '~/utils/schema';
import { ICONS } from '~/utils/icons';

type Schema = z.output<typeof CreateOutletValidation>;

const outletStore = useOutletStore();
const { adding, new_outlet } = storeToRefs(outletStore);

onMounted(() => {
	outletStore.resetNewOutlet();
});

const updateTaxRule = (tax_rule: any) => {
	new_outlet.value.tax_rule_code = tax_rule.code;
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
		longitude: longitude ?? undefined,
		latitude: latitude ?? undefined,
		tax_rule_code: tax_rule ?? undefined,
	};

	await outletStore.createOutlet();

	// Navigate back to outlets list after successful creation
	if (!outletStore.errors || outletStore.errors.length === 0) {
		await navigateTo('/outlets');
	}
};
</script>

<style scoped></style>
