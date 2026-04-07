<template>
	<ZPagePanel id="discounts-edit" :title="$t('pages.editDiscount')" back-to="/marketing/discounts">
		<template #toolbar>
			<UButton color="primary" variant="solid" :loading="updating" @click="handleSave">
				{{ $t('common.save') }}
			</UButton>
			<UButton color="error" variant="ghost" :loading="loading" @click="handleDelete">
				{{ $t('common.delete') }}
			</UButton>
		</template>

		<div class="space-y-6" v-if="discount">
			<UCard>
				<template #header>
					<h3 class="text-lg font-semibold">{{ $t('pages.discountDetails') }}</h3>
				</template>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<UFormGroup :label="$t('form.code')">
						<UInput :model-value="discount.code" disabled />
					</UFormGroup>
					<UFormGroup :label="$t('form.description')" class="col-span-1 md:col-span-2" required>
						<UTextarea v-model="edit_form.description" />
					</UFormGroup>
				</div>
			</UCard>
		</div>
	</ZPagePanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation } from '#components';
import type { DiscountResponse } from '~/repository/modules/discount/discount.type';

const { t } = useI18n();
useHead({ title: () => t('pages.editDiscount') });

const route = useRoute();
const router = useRouter();
const discountStore = useDiscountStore();
const { loading, updating } = storeToRefs(discountStore);
const overlay = useOverlay();

const discount = ref<DiscountResponse | null>(null);
const edit_form = ref({ description: '' });

onMounted(async () => {
	const code = route.params.code as string;
	if (code) {
		const data = await discountStore.getDiscountByCode(code);
		if (data) {
			discount.value = data;
			edit_form.value.description = data.description || '';
		}
	}
});

const handleSave = async () => {
	if (!discount.value) return;
	const updated = await discountStore.updateDiscount(discount.value.code, {
		description: edit_form.value.description,
	});
	if (updated?.code) {
		router.push('/marketing/discounts');
	}
};

const handleDelete = () => {
	const d = discount.value;
	if (!d) return;

	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: t('pages.confirmDeleteDiscount'),
			action: 'delete',
			onConfirm: async () => {
				await discountStore.deleteDiscount(d.code);
				confirmModal.close();
				router.push('/marketing/discounts');
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};
</script>
