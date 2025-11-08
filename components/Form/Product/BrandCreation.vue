<template>
	<UForm :schema="CreateBrandValidation" :state="new_brand" class="space-y-4" @submit="onSubmit">
		<!-- *********************** General Info *********************** -->
		<div class="space-y-2">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">General Information</h3>
			<ZInputProductBrandGeneralInfo v-model:code="new_brand.code" v-model:description="new_brand.description" />
		</div>

		<!-- Submit Button -->
		<div class="flex justify-center pt-4">
			<UButton color="success" size="md" :loading="adding" type="submit">
				<UIcon :name="ICONS.CHECK_ROUNDED" class="w-4 h-4" />
				<span class="text-sm">Create Brand</span>
			</UButton>
		</div>
	</UForm>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { CreateBrandValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateBrandValidation>;

const brandStore = useBrandStore();
const { adding, new_brand } = storeToRefs(brandStore);

onMounted(() => {
	brandStore.resetNewProductBrand();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, description, is_active } = event.data;

	new_brand.value = {
		code,
		description,
		is_active,
	};

	const success = await brandStore.createBrand();

	if (success) {
		useRouter().back();
	}
};
</script>

<style scoped></style>
