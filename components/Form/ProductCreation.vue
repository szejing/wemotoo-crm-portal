<template>
	<div>
		<UForm :schema="CreateProductValidation" :state="state" class="space-y-4" @submit="onSubmit">
			<UCard>
				<template #header>
					<div class="flex justify-between">
						<h2>Basic</h2>
						<UCheckbox v-model="state.isActive" name="isActive" label="Active" color="green" />
					</div>
				</template>

				<div class="grid grid-cols-2 gap-2">
					<UFormGroup v-slot="{ error }" label="Product Code" name="code" required>
						<UInput v-model="state.code" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
					</UFormGroup>

					<UFormGroup v-slot="{ error }" label="Name" name="name" required>
						<UInput v-model="state.name" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
					</UFormGroup>
				</div>

				<UFormGroup label="Description" name="description" class="mt-2">
					<ClientOnly placeholder="loading...">
						<QuillEditor v-model:content="state.description" content-type="html" theme="snow" :options="options" />
					</ClientOnly>
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
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

type Schema = z.output<typeof CreateProductValidation>;

const state = reactive({
	code: undefined,
	name: undefined,
	description: undefined,
	isActive: true,
});

const options = {
	placeholder: 'Product description',
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	console.log(event);
};
</script>

<style scoped lang="css">
:deep(.ql-editor) {
	min-height: 200px;
}
:deep(.ql-toolbar.ql-snow) {
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
}
:deep(.ql-container.ql-snow) {
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
}
</style>
