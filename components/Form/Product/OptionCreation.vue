<template>
	<div>
		<UForm :schema="CreateProductOptionValidation" :state="new_prod_option" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputOptionGeneralInfo v-model:name="new_prod_option.name" v-model:values="new_prod_option.values" />
			<!-- *********************** General Info *********************** -->

			<div class="flex-center text-center mt-3">
				<UButton class="w-full sm:w-[50%]" size="md" color="success" variant="solid" type="submit" block :loading="adding">Create</UButton>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { CreateProductOptionValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateProductOptionValidation>;

const optionStore = useProductOptionStore();
const { adding, new_prod_option } = storeToRefs(optionStore);

onMounted(() => {
	optionStore.resetNewProductOption();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { name, values } = event.data;
	await optionStore.addProductOption(name, values ?? []);
};
</script>

<style scoped></style>
