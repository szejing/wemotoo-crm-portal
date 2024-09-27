<template>
	<div>
		<UForm :schema="CreateProductValidation" :state="state" class="space-y-4" @submit="onSubmit">
			<UCard>
				<template #header>
					<div class="w-full flex-between items-center">
						<h2>Details</h2>
						<div class="w-[50%] flex-jend items-center gap-4">
							<UCheckbox v-model="state.is_active" name="isActive" label="Active" color="green" />
							<UCheckbox v-model="state.is_service" name="isService" label="Service" color="green" />
						</div>
					</div>
				</template>

				<div class="section-grid-basic-details">
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
					<div class="section-grid-price-details mt-4">
						<UFormGroup label="Currency" name="currency">
							<ZSelectMenuCurrency />
						</UFormGroup>
					</div>

					<div class="section-grid-price-details gap-4 mt-4">
						<UFormGroup v-slot="{ error }" label="Selling Price" name="origSellPrice" required>
							<UInput
								v-model="state.origSellPrice"
								:trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
								placeholder="0.00"
								@input="formatCurrencyInput($event.target.value, $event.target)"
							>
								<template #leading>
									<h3>RM</h3>
								</template>
							</UInput>
						</UFormGroup>

						<UFormGroup v-slot="{ error }" label="Cost Price" name="costPrice">
							<UInput
								v-model="state.costPrice"
								:trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
								placeholder="0.00"
								@input="formatCurrencyInput($event.target.value, $event.target)"
							>
								<template #leading>
									<h3>RM</h3>
								</template>
							</UInput>
						</UFormGroup>

						<UFormGroup v-slot="{ error }" label="Sale Price" name="salePrice">
							<UInput
								v-model="state.salePrice"
								:trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
								placeholder="0.00"
								@input="formatCurrencyInput($event.target.value, $event.target)"
							>
								<template #leading>
									<h3>RM</h3>
								</template>
							</UInput>
						</UFormGroup>
					</div>
				</template>
			</UCard>

			<div class="flex-center text-center">
				<UButton class="w-[100%] sm:w-[50%]" size="md" color="green" variant="solid" type="submit" block>Submit</UButton>
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
	// price details
	currency: undefined,
	costPrice: undefined,
	origSellPrice: undefined,
	salePrice: undefined,
});

const formatCurrencyInput = (input: string, event: any) => {
	if (event instanceof HTMLInputElement) {
		let value = input.replace(/\D/g, ''); // Remove non-numeric characters
		let cursorLength = value.length;
		if (value.length > 0) {
			value = formatCurrency(parseFloat(value), 2);
			cursorLength = value.length;
		}
		event.focus();
		event.setSelectionRange(cursorLength, cursorLength);
		event.value = value;
	}
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
	@apply shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-50 focus:ring-2 focus:ring-primary-500 rounded-t-md;
}
:deep(.ql-container.ql-snow) {
	@apply shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-50 focus:ring-2 focus:ring-primary-500 rounded-b-md;
}

.section-grid-basic-details {
	@apply grid grid-cols-2 gap-4;
}

.section-grid-price-details {
	@apply grid grid-cols-3 gap-4;
}
</style>
