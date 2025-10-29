<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[60%] md:w-[40%] lg:w-[30%]',
		}"
	>
		<UForm :schema="UpdateBrandValidation" :state="state.brand" class="space-y-4" @submit="onSubmit">
			<UCard>
				<div class="flex-jbetween-icenter gap-4">
					<h3>Update Brand</h3>
					<UCheckbox v-model="state.brand.is_active" name="isActive" label="Active" color="success" />
				</div>

				<!-- *********************** General Info *********************** -->
				<ZInputProductBrandGeneralInfo v-model:code="state.brand.code" v-model:description="state.brand.description" />
				<!-- *********************** General Info *********************** -->

				<template #footer>
					<div class="flex-jbetween-icenter">
						<UButton color="danger" variant="ghost" @click="onDelete">Delete</UButton>

						<div class="flex-jend gap-4">
							<UButton color="neutral" variant="soft" @click="onCancel">Cancel</UButton>
							<UButton color="primary" variant="solid" :loading="updating" type="submit">Update</UButton>
						</div>
					</div>
				</template>
			</UCard>
		</UForm>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { UpdateBrandValidation } from '~/utils/schema';
import type { Brand } from '~/utils/types/brand';

type Schema = z.output<typeof UpdateBrandValidation>;

const props = defineProps({
	brand: {
		type: Object as PropType<Brand> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'delete', 'cancel']);

const state = reactive({
	brand: props.brand,
});

const brandStore = useBrandStore();
const { updating } = storeToRefs(brandStore);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { code, description, is_active } = event.data;
	emit('update', { code, description, is_active });
};

const onCancel = () => {
	emit('cancel');
};

const onDelete = () => {
	emit('delete');
};
</script>

<style scoped lang="postcss"></style>
