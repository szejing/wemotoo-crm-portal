<template>
	<div>
		<UForm :schema="CreateProductOptionValidation" :state="newProductOption" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputOptionGeneralInfo v-model:name="newProductOption.name" v-model:values="newProductOption.values" />
			<!-- *********************** General Info *********************** -->

			<div class="flex-center text-center mt-3">
				<UButton class="w-[100%] sm:w-[50%]" size="md" color="green" variant="solid" type="submit" block :loading="adding">Create</UButton>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { useProductOptionsStore } from '~/stores/ProductOptions/ProductOptions';

import { CreateProductOptionValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateProductOptionValidation>;

const optionStore = useProductOptionsStore();
const { adding, newProductOption } = storeToRefs(optionStore);

onMounted(() => {
	optionStore.resetNewProductOption();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { name, values } = event.data;
	await optionStore.addProductOption(name, values ?? []);
};
</script>

<style scoped lang="postcss"></style>
