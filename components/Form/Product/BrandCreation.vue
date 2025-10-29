<template>
	<div>
		<UForm :schema="CreateBrandValidation" :state="new_brand" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputProductBrandGeneralInfo v-model:code="new_brand.code" v-model:description="new_brand.description" />
			<!-- *********************** General Info *********************** -->
			<div class="flex-center text-center mt-3">
				<UButton size="md" color="success" variant="solid" type="submit" block :loading="adding">Create</UButton>
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
const { adding, new_brand } = storeToRefs(brandStore);

onMounted(() => {
	brandStore.resetNewBrand();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, description, is_active } = event.data;

	new_brand.value = {
		code,
		description,
		is_active,
	};

	await brandStore.createBrand();
};
</script>

<style scoped lang="postcss"></style>
