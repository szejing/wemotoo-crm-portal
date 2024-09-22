<template>
	<div>
		<UForm :schema="CreateProductValidation" :state="state" class="space-y-4" @submit="onSubmit">
			<UCard>
				<template #header>
					<div class="w-full flex justify-between items-center">
						<h2>Details</h2>
						<div class="w-[50%] flex justify-end items-center gap-4">
							<UCheckbox v-model="state.is_active" name="isActive" label="Active" color="green" />
							<UCheckbox v-model="state.is_service" name="isService" label="Service" color="green" />
						</div>
					</div>
				</template>

				<div class="grid grid-cols-2 gap-4">
					<UFormGroup v-slot="{ error }" label="Product Code" name="code" required>
						<UInput v-model="state.code" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
					</UFormGroup>

					<UFormGroup v-slot="{ error }" label="Title" name="title" required>
						<UInput v-model="state.title" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
					</UFormGroup>

					<UFormGroup v-slot="{ error }" label="Subtitle" name="subtitle">
						<UInput v-model="state.subtitle" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
					</UFormGroup>
				</div>

				<UFormGroup class="mt-4" label="Description" name="description">
					<ZTextEditor v-model:value="state.description" placeholder="Product Description" />
				</UFormGroup>
			</UCard>

			<UCard>
				<template #header>
					<h2>Pricing</h2>
				</template>
			</UCard>

			<div>
				<UButton size="md" color="primary" variant="outline" type="submit">Submit</UButton>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { CreateProductValidation } from '~/utils/schema';

type Schema = z.output<typeof CreateProductValidation>;

const state = reactive({
	code: undefined,
	title: undefined,
	subtitle: undefined,
	description: undefined,
	is_active: true,
	is_service: false,
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	console.log(event);
};
</script>

<style scoped lang="css">
:deep(.ql-editor) {
	min-height: 200px;
}
:deep(.ql-toolbar.ql-snow) {
	@apply shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-50 focus:ring-2 focus:ring-primary-500 rounded-t-md;
}
:deep(.ql-container.ql-snow) {
	@apply shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-50 focus:ring-2 focus:ring-primary-500 rounded-b-md;
}
</style>
