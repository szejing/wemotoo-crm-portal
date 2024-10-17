<template>
	<div>
		<UForm :schema="CreateProductCategoryValidation" :state="newProductCategory" class="space-y-4" @submit="onSubmit">
			<!-- *********************** General Info *********************** -->
			<ZInputCategoryGeneralInfo
				v-model:code="newProductCategory.code"
				v-model:name="newProductCategory.name"
				v-model:description="newProductCategory.description"
			/>
			<!-- *********************** General Info *********************** -->

			<div class="flex-center text-center">
				<UButton class="w-[100%] sm:w-[50%]" size="md" color="green" variant="solid" type="submit" block>Create</UButton>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';

import { CreateProductCategoryValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateProductCategoryValidation>;

const categoryStore = useProductCategoriesStore();
const { newProductCategory } = storeToRefs(categoryStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	console.log(event);
};
</script>

<style scoped lang="css"></style>
