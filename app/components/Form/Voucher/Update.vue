<template>
	<div class="w-full space-y-6">
		<UForm ref="uformRef" :schema="voucherUpdateSchema" :state="formState" class="space-y-6" @submit="onSubmit">
			<UCard>
				<template #header>
					<h3 class="text-lg font-semibold">{{ $t('pages.voucherDetails') }}</h3>
				</template>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<UFormField :label="$t('form.code')" name="code">
						<UInput :model-value="voucher.code" disabled />
					</UFormField>
					<UFormField :label="$t('form.name')" name="name" required>
						<UInput v-model="formState.name" />
					</UFormField>
					<UFormField :label="$t('form.description')" name="description" class="col-span-1 md:col-span-2">
						<UTextarea v-model="formState.description" />
					</UFormField>
					<UFormField :label="$t('form.discountCode')" name="discount_code">
						<UInput v-model="formState.discount_code" />
					</UFormField>
					<UFormField :label="$t('form.usageLimit')" name="usage_limit">
						<UInput
							:model-value="usageLimitDisplay"
							type="number"
							min="1"
							:placeholder="$t('form.usageLimit')"
							@update:model-value="onUsageLimitInput"
						/>
					</UFormField>
				</div>
			</UCard>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod';
import type { Voucher } from '~/utils/types/voucher';

const { t } = useI18n();

const props = defineProps<{
	voucher: Voucher;
}>();

function buildVoucherUpdateSchema(translate: typeof t) {
	return z.object({
		code: z.string(),
		name: z.string().min(1, translate('validation.voucher.nameRequired')),
		description: z.string(),
		discount_code: z.string(),
		usage_limit: z.union([z.number().int().positive(), z.null()]).optional(),
	});
}

type VoucherUpdateForm = z.infer<ReturnType<typeof buildVoucherUpdateSchema>>;

const voucherUpdateSchema = computed(() => buildVoucherUpdateSchema(t));

const uformRef = ref<{ submit: () => void } | null>(null);

const formState = reactive({
	code: '',
	name: '',
	description: '',
	discount_code: '',
	usage_limit: null as number | null,
});

const usageLimitDisplay = computed(() =>
	formState.usage_limit != null && formState.usage_limit > 0 ? String(formState.usage_limit) : '',
);

const onUsageLimitInput = (value: string | number) => {
	if (value === '' || value === null || value === undefined) {
		formState.usage_limit = null;
		return;
	}
	const n = typeof value === 'number' ? value : Number(value);
	formState.usage_limit = Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
};

watch(
	() => props.voucher,
	(v) => {
		if (!v) return;
		formState.code = v.code;
		formState.name = v.name;
		formState.description = v.description || '';
		formState.discount_code = v.discount_code || '';
		formState.usage_limit = v.usage_limit != null && v.usage_limit > 0 ? v.usage_limit : null;
	},
	{ immediate: true },
);

const onSubmit = async (_event: FormSubmitEvent<VoucherUpdateForm>) => {
	const voucherStore = useVoucherStore();
	const updated = await voucherStore.updateVoucher(props.voucher.code, {
		name: formState.name,
		description: formState.description,
		discount_code: formState.discount_code.trim() || undefined,
		usage_limit: formState.usage_limit ?? undefined,
	});
	if (updated?.code) {
		await navigateTo('/marketing/vouchers');
	}
};

const submit = () => {
	uformRef.value?.submit();
};

defineExpose({ submit });
</script>
