<template>
	<div>
		<UForm :schema="CreateTaxGroupValidation" :state="newTaxGroup" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputTaxGroupGeneralInfo v-model:code="newTaxGroup.code" v-model:description="newTaxGroup.description" v-model:taxes="newTaxGroup.taxes" />

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
import { CreateTaxGroupValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateTaxGroupValidation>;

const taxGroupStore = useTaxGroupStore();
const { adding, newTaxGroup } = storeToRefs(taxGroupStore);

onMounted(() => {
	taxGroupStore.resetNewTaxGroup();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, description, taxes } = event.data;

	newTaxGroup.value = {
		code,
		description,
		taxes: taxes ?? [],
	};

	await taxGroupStore.createTaxGroup();
};
</script>

<style scoped lang="postcss"></style>
