<template>
	<ZPagePanel id="vouchers-edit" :title="$t('pages.editVoucher')" back-to="/marketing/vouchers">
		<template #toolbar>
			<UButton color="primary" variant="solid" :loading="updating" @click="handleSave">
				{{ $t('common.save') }}
			</UButton>
			<UButton color="error" variant="ghost" :loading="loading" @click="handleDelete">
				{{ $t('common.delete') }}
			</UButton>
		</template>

		<div v-if="voucher" class="space-y-6">
			<UCard>
				<template #header>
					<h3 class="text-lg font-semibold">{{ $t('pages.voucherDetails') }}</h3>
				</template>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<UFormGroup :label="$t('form.code')">
						<UInput :model-value="voucher.code" disabled />
					</UFormGroup>
					<UFormGroup :label="$t('form.name')" required>
						<UInput v-model="edit_form.name" />
					</UFormGroup>
					<UFormGroup :label="$t('form.description')" class="col-span-1 md:col-span-2">
						<UTextarea v-model="edit_form.description" />
					</UFormGroup>
					<UFormGroup :label="$t('form.discountCode')">
						<UInput v-model="edit_form.discount_code" />
					</UFormGroup>
					<UFormGroup :label="$t('form.usageLimit')">
						<UInput
							:model-value="usageLimitDisplay"
							type="number"
							min="1"
							:placeholder="$t('form.usageLimit')"
							@update:model-value="onUsageLimitInput"
						/>
					</UFormGroup>
				</div>
			</UCard>
		</div>
	</ZPagePanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation } from '#components';
import type { VoucherResponse } from '~/repository/modules/voucher/voucher.type';
import { useVoucherStore } from '~/stores/voucher/voucher';

const { t } = useI18n();
useHead({ title: () => t('pages.editVoucher') });

const route = useRoute();
const router = useRouter();
const voucherStore = useVoucherStore();
const { loading, updating } = storeToRefs(voucherStore);
const overlay = useOverlay();

const voucher = ref<VoucherResponse | null>(null);
const edit_form = ref({
	name: '',
	description: '',
	discount_code: '',
	usage_limit: null as number | null,
});

const usageLimitDisplay = computed(() =>
	edit_form.value.usage_limit != null && edit_form.value.usage_limit > 0 ? String(edit_form.value.usage_limit) : '',
);

const onUsageLimitInput = (value: string | number) => {
	if (value === '' || value === null || value === undefined) {
		edit_form.value.usage_limit = null;
		return;
	}
	const n = typeof value === 'number' ? value : Number(value);
	edit_form.value.usage_limit = Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
};

onMounted(async () => {
	const code = (route.params.code as string) || '';
	if (code) {
		const data = await voucherStore.getVoucherByCode(code);
		if (data) {
			voucher.value = data;
			edit_form.value.name = data.name;
			edit_form.value.description = data.description || '';
			edit_form.value.discount_code = data.discount_code || '';
			edit_form.value.usage_limit = data.usage_limit ?? null;
		}
	}
});

const handleSave = async () => {
	if (!voucher.value) return;
	const payload = {
		name: edit_form.value.name,
		description: edit_form.value.description,
		discount_code: edit_form.value.discount_code.trim() || undefined,
		usage_limit: edit_form.value.usage_limit ?? undefined,
	};
	const success = await voucherStore.updateVoucher(voucher.value.code, payload);
	if (success) {
		router.push('/marketing/vouchers');
	}
};

const handleDelete = () => {
	if (!voucher.value) return;

	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: t('pages.confirmDeleteVoucher'),
			action: 'delete',
			onConfirm: async () => {
				await voucherStore.deleteVoucher(voucher.value!.code);
				confirmModal.close();
				router.push('/marketing/vouchers');
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};
</script>
