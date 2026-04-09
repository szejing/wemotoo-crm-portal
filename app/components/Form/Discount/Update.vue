<template>
	<div class="w-full space-y-6">
		<UForm ref="uformRef" :schema="discountUpdateSchema" :state="formState" class="space-y-6" @submit="onSubmit">
			<UCard>
				<template #header>
					<h3 class="text-lg font-semibold">{{ $t('pages.discountDetails') }}</h3>
				</template>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<UFormField :label="$t('form.code')" name="code">
						<UInput :model-value="discount.code" disabled />
					</UFormField>
					<UFormField :label="$t('form.description')" name="description" required class="col-span-1 md:col-span-2">
						<UTextarea v-model="formState.description" />
					</UFormField>
				</div>
			</UCard>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod';
import type { Discount } from '~/utils/types/discount';

const { t } = useI18n();

const props = defineProps<{
	discount: Discount;
}>();

function buildDiscountUpdateSchema(translate: typeof t) {
	return z.object({
		code: z.string(),
		description: z.string().min(1, translate('validation.discount.descriptionRequired')),
	});
}

type DiscountUpdateForm = z.infer<ReturnType<typeof buildDiscountUpdateSchema>>;

const discountUpdateSchema = computed(() => buildDiscountUpdateSchema(t));

const uformRef = ref<{ submit: () => void } | null>(null);

const formState = reactive({
	code: '',
	description: '',
});

watch(
	() => props.discount,
	(d) => {
		if (!d) return;
		formState.code = d.code;
		formState.description = d.description || '';
	},
	{ immediate: true },
);

const onSubmit = async (_event: FormSubmitEvent<DiscountUpdateForm>) => {
	const discountStore = useDiscountStore();
	const updated = await discountStore.updateDiscount(props.discount.code, {
		description: formState.description,
	});
	if (updated?.discount?.code) {
		await navigateTo('/marketing/discounts');
	}
};

const submit = () => {
	uformRef.value?.submit();
};

defineExpose({ submit });
</script>
