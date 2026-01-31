<template>
	<UDashboardPanel id="product-detail" grow>
		<template #header>
			<UDashboardNavbar :title="`Product Detail #${current_product?.code ?? code}`" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="container w-full mx-auto px-4 sm:px-6 py-4">
				<!-- Loading skeleton: mirrors Form/Product/Update.vue structure -->
				<div v-if="isLoading" class="w-full animate-in fade-in duration-200">
					<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
						<!-- Left sidebar nav skeleton -->
						<div class="hidden lg:block lg:col-span-3">
							<div class="sticky top-4 space-y-2">
								<template v-for="i in 5" :key="i">
									<div class="rounded-lg px-4 py-3 flex items-center gap-3">
										<USkeleton class="h-6 w-6 rounded-full shrink-0" />
										<div class="flex-1 min-w-0 space-y-2">
											<USkeleton class="h-4 w-24" />
											<USkeleton class="h-3 w-full max-w-[140px]" />
										</div>
									</div>
								</template>
							</div>
						</div>
						<!-- Right content: cards skeleton -->
						<div class="lg:col-span-9 space-y-6">
							<!-- Card 1: Basic Information -->
							<div class="rounded-lg border border-neutral-200 shadow-md overflow-hidden">
								<div class="p-4 sm:p-6 border-b border-neutral-200">
									<div class="flex items-start justify-between gap-4">
										<div class="flex-1 space-y-2">
											<div class="flex items-center gap-2">
												<USkeleton class="h-6 w-6 rounded" />
												<USkeleton class="h-6 w-40" />
											</div>
											<USkeleton class="h-4 w-64" />
										</div>
										<USkeleton class="h-5 w-5 rounded shrink-0" />
									</div>
								</div>
								<div class="p-4 sm:p-6 space-y-6">
									<div class="flex justify-end">
										<USkeleton class="h-5 w-16 rounded" />
									</div>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div class="space-y-2">
											<USkeleton class="h-4 w-28" />
											<USkeleton class="h-3 w-48" />
											<USkeleton class="h-10 w-full" />
										</div>
										<div class="space-y-2">
											<USkeleton class="h-4 w-28" />
											<USkeleton class="h-3 w-48" />
											<USkeleton class="h-10 w-full" />
										</div>
									</div>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div class="space-y-2">
											<USkeleton class="h-4 w-32" />
											<USkeleton class="h-10 w-full" />
										</div>
										<div class="space-y-2">
											<USkeleton class="h-4 w-24" />
											<USkeleton class="h-10 w-full" />
										</div>
									</div>
									<USkeleton class="h-px w-full" />
									<div class="space-y-4">
										<USkeleton class="h-5 w-36" />
										<div class="flex flex-col gap-6 sm:flex-row sm:justify-between">
											<div class="space-y-2">
												<USkeleton class="h-4 w-20" />
												<USkeleton class="h-3 w-40" />
												<USkeleton class="h-[120px] w-[250px] rounded-xl" />
											</div>
											<div class="space-y-2">
												<USkeleton class="h-4 w-28" />
												<USkeleton class="h-3 w-40" />
												<USkeleton class="h-[120px] w-[250px] rounded-xl" />
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- Card 2: Classification -->
							<div class="rounded-lg border border-neutral-200 shadow-md overflow-hidden">
								<div class="p-4 sm:p-6 border-b border-neutral-200">
									<div class="flex items-start justify-between gap-4">
										<div class="flex-1 space-y-2">
											<div class="flex items-center gap-2">
												<USkeleton class="h-6 w-6 rounded" />
												<USkeleton class="h-6 w-32" />
											</div>
											<USkeleton class="h-4 w-56" />
										</div>
										<USkeleton class="h-5 w-5 rounded shrink-0" />
									</div>
								</div>
								<div class="p-4 sm:p-6">
									<USkeleton class="h-20 w-full rounded-lg mb-6" />
									<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
										<div class="space-y-2">
											<USkeleton class="h-4 w-24" />
											<USkeleton class="h-10 w-full" />
										</div>
										<div class="space-y-2">
											<USkeleton class="h-4 w-16" />
											<USkeleton class="h-10 w-full" />
										</div>
										<div class="space-y-2">
											<USkeleton class="h-4 w-16" />
											<USkeleton class="h-10 w-full" />
										</div>
									</div>
								</div>
							</div>
							<!-- Card 3: Pricing -->
							<div class="rounded-lg border border-neutral-200 shadow-md overflow-hidden">
								<div class="p-4 sm:p-6 border-b border-neutral-200">
									<div class="flex items-start justify-between gap-4">
										<div class="flex-1 space-y-2">
											<div class="flex items-center gap-2">
												<USkeleton class="h-6 w-6 rounded" />
												<USkeleton class="h-6 w-20" />
											</div>
											<USkeleton class="h-4 w-52" />
										</div>
										<USkeleton class="h-5 w-5 rounded shrink-0" />
									</div>
								</div>
								<div class="p-4 sm:p-6 space-y-6">
									<USkeleton class="h-16 w-full rounded-lg" />
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<template v-for="j in 4" :key="j">
											<div class="space-y-2">
												<USkeleton class="h-4 w-28" />
												<USkeleton class="h-10 w-full" />
											</div>
										</template>
									</div>
								</div>
							</div>
							<!-- Card 4: Variants -->
							<div class="rounded-lg border border-neutral-200 shadow-md overflow-hidden">
								<div class="p-4 sm:p-6 border-b border-neutral-200">
									<div class="flex-1 space-y-2">
										<div class="flex items-center gap-2">
											<USkeleton class="h-6 w-6 rounded" />
											<USkeleton class="h-6 w-36" />
										</div>
										<USkeleton class="h-4 w-64" />
									</div>
								</div>
								<div class="p-4 sm:p-6">
									<USkeleton class="h-20 w-full rounded-lg mb-6" />
									<USkeleton class="h-48 w-full rounded-lg" />
								</div>
							</div>
							<!-- Card 5: Review -->
							<div class="rounded-lg border-2 border-neutral-200 shadow-md overflow-hidden">
								<div class="p-4 sm:p-6 border-b border-neutral-200">
									<div class="flex-1 space-y-2">
										<div class="flex items-center gap-2">
											<USkeleton class="h-6 w-6 rounded" />
											<USkeleton class="h-6 w-40" />
										</div>
										<USkeleton class="h-4 w-56" />
									</div>
								</div>
								<div class="p-4 sm:p-6 space-y-4">
									<USkeleton class="h-16 w-full rounded-lg" />
									<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
										<template v-for="k in 5" :key="k">
											<USkeleton class="h-24 w-full rounded-lg" />
										</template>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
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
