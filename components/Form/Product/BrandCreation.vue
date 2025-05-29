<template>
	<div>
		<UForm :schema="CreateBrandValidation" :state="newBrand" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputProductBrandGeneralInfo v-model:value="newBrand.value" />
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
import { CreateBrandValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateBrandValidation>;

const brandStore = useBrandStore();
const { adding, newBrand } = storeToRefs(brandStore);

onMounted(() => {
	brandStore.resetNewBrand();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, description, is_active } = event.data;

	newBrand.value = {
		code,
		description,
		is_active,
	};

	await brandStore.createBrand();
};
</script>

<style scoped lang="postcss"></style>
