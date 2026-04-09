<template>
	<ZPagePanel id="discounts-edit" :title="`${$t('pages.editDiscount')} #${current_discount?.code ?? code}`" back-to="/marketing/discounts" grow>
		<div class="container w-full mx-auto">
			<FormDiscountUpdateLoading v-if="isLoading" />
			<FormDiscountUpdate v-else-if="current_discount" ref="formRef" :discount="current_discount" />
		</div>

		<template #footer>
			<div v-if="current_discount" class="w-full backdrop-blur-sm border-t border-neutral-200 shadow-md z-50">
				<div class="mx-auto px-4 sm:px-6 py-4">
					<!-- Desktop Layout -->
					<div class="hidden md:flex justify-between items-center gap-3">
						<UButton color="error" variant="ghost" size="lg" :loading="updating" class="opacity-50 hover:opacity-100 cursor-pointer" @click="deleteDiscount">
							<UIcon :name="ICONS.TRASH" />
							{{ $t('common.delete') }}
						</UButton>

						<div class="flex gap-3">
							<UButton color="neutral" variant="outline" size="lg" class="cursor-pointer" @click="cancel">{{ $t('common.cancel') }}</UButton>

							<UButton color="success" variant="solid" size="lg" :loading="updating" class="cursor-pointer" @click="saveDiscount">
								<UIcon :name="ICONS.CHECK_ROUNDED" />
								{{ $t('common.save') }}
							</UButton>
						</div>
					</div>

					<!-- Mobile Layout -->
					<div class="md:hidden flex flex-col gap-2">
						<UButton color="success" size="md" class="w-full opacity-50 hover:opacity-100 cursor-pointer" :loading="updating" @click="saveDiscount">
							<UIcon :name="ICONS.CHECK_ROUNDED" />
							<span class="text-sm">{{ $t('common.save') }}</span>
						</UButton>
						<div class="flex gap-2">
							<UButton
								color="error"
								variant="ghost"
								size="sm"
								class="flex-1 opacity-50 hover:opacity-100 cursor-pointer"
								:loading="updating"
								@click="deleteDiscount"
							>
								<UIcon :name="ICONS.TRASH" class="w-4 h-4" />
								<span class="text-xs">{{ $t('common.delete') }}</span>
							</UButton>
							<UButton color="neutral" variant="outline" size="sm" class="flex-1 cursor-pointer" @click="cancel">
								<span class="text-xs">{{ $t('common.cancel') }}</span>
							</UButton>
						</div>
					</div>
				</div>
			</div>
		</template>
	</ZPagePanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation } from '#components';

const route = useRoute();
const code = route.params.code as string;

const overlay = useOverlay();
const discountStore = useDiscountStore();
const { updating, current_discount } = storeToRefs(discountStore);
const formRef = ref<{ submit: () => void } | null>(null);

const isLoading = ref(!current_discount.value);

const { t } = useI18n();
useHead({ title: () => `${t('pages.editDiscount')} #${current_discount.value?.code ?? code}` });

onBeforeRouteLeave(() => {
	current_discount.value = undefined;
});

onBeforeMount(async () => {
	if (!current_discount.value) {
		const discount = await discountStore.getDiscountByCode(code);

		if (discount) {
			discountStore.current_discount = discount;
		} else {
			await navigateTo('/marketing/discounts');
		}
		isLoading.value = false;
	} else {
		isLoading.value = false;
	}
});

const saveDiscount = () => {
	formRef.value?.submit();
};

const cancel = () => {
	useRouter().back();
};

const deleteDiscount = async () => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: t('pages.confirmDeleteDiscount'),
			action: 'delete',
			onConfirm: async () => {
				await discountStore.deleteDiscount(current_discount.value!.code);
				confirmModal.close();
				navigateTo('/marketing/discounts');
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};
</script>

<style scoped></style>
