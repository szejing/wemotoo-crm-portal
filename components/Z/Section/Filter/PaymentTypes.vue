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
import type { z } from 'zod';
import { FilterPaymentTypeValidation } from '~/utils/schema';

type Schema = z.output<typeof FilterPaymentTypeValidation>;

const state = reactive({
	query: undefined,
	currency_code: 'MYR',
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, desc, short_desc } = event.data;

	console.log(code, desc, short_desc);
};
</script>

<style scoped lang="postcss"></style>
