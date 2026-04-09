<template>
	<ZPagePanel id="vouchers-edit" :title="`${$t('pages.editVoucher')} #${current_voucher?.code ?? code}`" back-to="/marketing/vouchers" grow>
		<div class="container w-full mx-auto">
			<FormVoucherUpdateLoading v-if="isLoading" />
			<FormVoucherUpdate v-else-if="current_voucher" ref="formRef" :voucher="current_voucher" />
		</div>

		<template #footer>
			<div v-if="current_voucher" class="w-full backdrop-blur-sm border-t border-neutral-200 shadow-md z-50">
				<div class="mx-auto px-4 sm:px-6 py-4">
					<!-- Desktop Layout -->
					<div class="hidden md:flex justify-between items-center gap-3">
						<UButton color="error" variant="ghost" size="lg" :loading="updating" class="opacity-50 hover:opacity-100 cursor-pointer" @click="deleteVoucher">
							<UIcon :name="ICONS.TRASH" />
							{{ $t('common.delete') }}
						</UButton>

						<div class="flex gap-3">
							<UButton color="neutral" variant="outline" size="lg" class="cursor-pointer" @click="cancel">{{ $t('common.cancel') }}</UButton>

							<UButton color="success" variant="solid" size="lg" :loading="updating" class="cursor-pointer" @click="saveVoucher">
								<UIcon :name="ICONS.CHECK_ROUNDED" />
								{{ $t('common.save') }}
							</UButton>
						</div>
					</div>

					<!-- Mobile Layout -->
					<div class="md:hidden flex flex-col gap-2">
						<UButton color="success" size="md" class="w-full opacity-50 hover:opacity-100 cursor-pointer" :loading="updating" @click="saveVoucher">
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
								@click="deleteVoucher"
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
const voucherStore = useVoucherStore();
const { updating, current_voucher } = storeToRefs(voucherStore);
const formRef = ref<{ submit: () => void } | null>(null);

const isLoading = ref(!current_voucher.value);

const { t } = useI18n();
useHead({ title: () => `${t('pages.editVoucher')} #${current_voucher.value?.code ?? code}` });

onBeforeRouteLeave(() => {
	current_voucher.value = undefined;
});

onBeforeMount(async () => {
	if (!current_voucher.value) {
		const voucher = await voucherStore.getVoucherByCode(code);

		if (voucher) {
			voucherStore.current_voucher = voucher;
		} else {
			await navigateTo('/marketing/vouchers');
		}
		isLoading.value = false;
	} else {
		isLoading.value = false;
	}
});

const saveVoucher = () => {
	formRef.value?.submit();
};

const cancel = () => {
	useRouter().back();
};

const deleteVoucher = async () => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: t('pages.confirmDeleteVoucher'),
			action: 'delete',
			onConfirm: async () => {
				await voucherStore.deleteVoucher(current_voucher.value!.code);
				confirmModal.close();
				navigateTo('/marketing/vouchers');
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
