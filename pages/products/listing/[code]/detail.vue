<template>
	<UDashboardPanel id="product-detail" grow>
		<template #header>
			<UDashboardNavbar :title="`Product Detail #${current_product?.code}`" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="container w-full mx-auto px-4 sm:px-6 py-4">
				<FormProductUpdate ref="formRef" :product="current_product!" />
			</div>
		</template>

		<template #footer>
			<!-- Fixed Footer with Actions -->
			<div class="w-full backdrop-blur-sm border-t border-neutral-200 shadow-md z-50">
				<div class="mx-auto px-4 sm:px-6 py-4">
					<!-- Desktop Layout -->
					<div class="hidden md:flex justify-between items-center gap-3">
						<UButton color="error" variant="ghost" size="lg" :loading="updating" class="opacity-50 hover:opacity-100" @click="() => deleteProduct()">
							<UIcon :name="ICONS.TRASH" />
							Delete
						</UButton>

						<div class="flex gap-3">
							<UButton color="neutral" variant="outline" size="lg" @click="navigateTo('/products')"> Cancel </UButton>

							<UButton color="success" variant="solid" size="lg" :loading="updating" @click="() => updateProduct()">
								<UIcon :name="ICONS.CHECK_ROUNDED" />
								Update Product
							</UButton>
						</div>
					</div>

					<!-- Mobile Layout -->
					<div class="md:hidden flex flex-col gap-2">
						<UButton color="error" size="md" class="w-full opacity-50 hover:opacity-100" :loading="updating" @click="() => deleteProduct()">
							<UIcon :name="ICONS.TRASH" class="w-4 h-4" />
							<span class="text-sm">Update Product</span>
						</UButton>
						<div class="flex gap-2">
							<UButton color="neutral" variant="soft" size="sm" class="flex-1" :loading="updating" @click="() => updateProduct()">
								<UIcon :name="ICONS.SAVE" class="w-4 h-4" />
								<span class="text-xs">Delete</span>
							</UButton>
							<UButton color="neutral" variant="outline" size="sm" class="flex-1" @click="navigateTo('/products')">
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
import { ZModalConfirmation, ZModalLoading } from '#components';

const overlay = useOverlay();
const productStore = useProductStore();
const { updating, current_product } = storeToRefs(productStore);
const new_thumbnail = ref<File | undefined>(undefined);
const new_images = ref<File[]>([]);

useHead({ title: 'Wemotoo CRM - Product Detail #' + current_product.value!.code });

definePageMeta({
	middleware: 'product-detail',
});

onBeforeRouteLeave(() => {
	current_product.value = undefined;
});

const updateProduct = async () => {
	const loadingModal = overlay.create(ZModalLoading, {
		props: {
			key: 'loading',
		},
	});

	loadingModal.open();

	try {
		await productStore.updateProduct(
			{
				code: current_product.value!.code!,
				name: current_product.value!.name,
				short_desc: current_product.value!.short_desc,
				long_desc: current_product.value!.long_desc,
				is_discountable: current_product.value!.is_discountable,
				is_giftcard: current_product.value!.is_giftcard,
				is_active: current_product.value!.is_active,
				status: current_product.value!.status,
				category_codes: current_product.value!.categories?.map((category) => category.code!) ?? [],
				tag_ids: current_product.value!.tags?.map((tag) => tag.id!) ?? [],
				type_id: current_product.value!.type,
				brand_codes: current_product.value!.brands?.map((brand) => brand.code!) ?? [],
				price_types: current_product.value!.price_types,
				options: current_product.value!.options,
				variants: current_product.value!.variants,
				thumbnail: current_product.value!.thumbnail,
				images: current_product.value!.images,
				metadata: current_product.value!.metadata,
			},
			new_thumbnail.value ?? undefined,
			new_images.value ?? undefined,
		);

		navigateTo(`/products`);
	} catch (error) {
		console.error(error);
	} finally {
		loadingModal.close();
	}
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
