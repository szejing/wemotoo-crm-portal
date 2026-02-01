<template>
	<UDashboardPanel id="product-detail" grow>
		<template #header>
			<UDashboardNavbar :title="`Product Detail #${current_product?.code ?? code}`" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="container w-full mx-auto px-4 sm:px-6 py-4">
				<FormProductUpdateLoading v-if="isLoading" />
				<FormProductUpdate v-else-if="current_product" ref="formRef" :product="current_product" />
			</div>
		</template>

		<template #footer>
			<!-- Fixed Footer with Actions -->
			<div v-if="current_product" class="w-full backdrop-blur-sm border-t border-neutral-200 shadow-md z-50">
				<div class="mx-auto px-4 sm:px-6 py-4">
					<!-- Desktop Layout -->
					<div class="hidden md:flex justify-between items-center gap-3">
						<UButton color="error" variant="ghost" size="lg" :loading="updating" class="opacity-50 hover:opacity-100" @click="() => deleteProduct()">
							<UIcon :name="ICONS.TRASH" />
							Delete
						</UButton>

						<div class="flex gap-3">
							<UButton color="neutral" variant="outline" size="lg" @click="cancel"> Cancel </UButton>

							<UButton color="success" variant="solid" size="lg" :loading="updating" @click="() => updateProduct()">
								<UIcon :name="ICONS.CHECK_ROUNDED" />
								Update Product
							</UButton>
						</div>
					</div>

					<!-- Mobile Layout -->
					<div class="md:hidden flex flex-col gap-2">
						<UButton color="success" size="md" class="w-full opacity-50 hover:opacity-100" :loading="updating" @click="() => updateProduct()">
							<UIcon :name="ICONS.CHECK_ROUNDED" />
							<span class="text-sm">Update Product</span>
						</UButton>
						<div class="flex gap-2">
							<UButton color="error" variant="ghost" size="sm" class="flex-1 opacity-50 hover:opacity-100" :loading="updating" @click="() => deleteProduct()">
								<UIcon :name="ICONS.SAVE" class="w-4 h-4" />
								<span class="text-xs">Delete</span>
							</UButton>
							<UButton color="neutral" variant="outline" size="sm" class="flex-1" @click="cancel">
								<span class="text-xs">Cancel</span>
							</UButton>
						</div>
					</div>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation } from '#components';

definePageMeta({ middleware: 'product-detail' });

const route = useRoute();
const code = route.params.code as string;

const overlay = useOverlay();
const productStore = useProductStore();
const { updating, current_product } = storeToRefs(productStore);
const formRef = ref<{ onSubmit: () => Promise<void> } | null>(null);

const isLoading = ref(!current_product.value);

useHead({ title: 'Wemotoo CRM - Product Detail #' + (current_product.value?.code ?? code) });

onBeforeRouteLeave(() => {
	current_product.value = undefined;
});

onBeforeMount(async () => {
	if (!current_product.value) {
		const product = await productStore.getProduct(code as string);

		if (product) {
			productStore.current_product = product;
		} else {
			await navigateTo('/products/listing');
		}
		isLoading.value = false;
	} else {
		isLoading.value = false;
	}
});

const updateProduct = async () => {
	if (formRef.value) {
		await formRef.value.onSubmit();
	}
};

const cancel = () => {
	useRouter().back();
};

const deleteProduct = async () => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: 'Are you sure you want to delete this product ?',
			action: 'delete',
			onConfirm: async () => {
				await productStore.deleteProduct(current_product.value!.code!);
				confirmModal.close();
				navigateTo(`/products`);
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
