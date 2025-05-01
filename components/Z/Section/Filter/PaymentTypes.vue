<template>
	<UCard>
		<UForm :schema="FilterPaymentTypeValidation" :state="state" class="grid grid-cols-4 gap-4" @submit="onSubmit">
			<UFormGroup name="query" class="col-span-2">
				<UInput v-model="state.query" placeholder="Search by Code or Description..." :icon="ICONS.SEARCH_ROUNDED" />
			</UFormGroup>

			<UFormGroup name="currency_code" class="col-start-4">
				<ZSelectMenuCurrency v-model:currency-code="state.currency_code" />
			</UFormGroup>
		</UForm>
	</UCard>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import { isEmptyOrNull } from 'wemotoo-common';
import type { z } from 'zod';
import { FilterPaymentTypeValidation } from '~/utils/schema';

type Schema = z.output<typeof FilterPaymentTypeValidation>;

const state = reactive({
	query: undefined,
	currency_code: 'MYR',
});

const onSubmit = async (_: FormSubmitEvent<Schema>) => {
	const paymentMethodStore = usePaymentMethodStore();
	await paymentMethodStore.getPaymentMethods({
		q: isEmptyOrNull(state.query ?? '') ? undefined : state.query,
	});
};
</script>

<style scoped lang="postcss"></style>
