<template>
	<UDashboardPanel id="product-create" grow>
		<template #header>
			<UDashboardNavbar title="Add New Product" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="container w-full mx-auto px-4 sm:px-6 py-4">
				<FormProductCreation ref="formRef" />
			</div>
		</template>

		<template #footer>
			<!-- Fixed Footer with Actions -->
			<div class="w-full backdrop-blur-sm border-t border-neutral-200 shadow-md z-50">
				<div class="mx-auto px-4 sm:px-6 py-4">
					<!-- Desktop Layout -->
					<div class="hidden md:flex justify-between items-center gap-3">
						<UButton color="neutral" variant="ghost" size="lg" :loading="adding" @click="() => saveDraft()">
							<UIcon :name="ICONS.SAVE" />
							Save Draft
						</UButton>

						<div class="flex gap-3">
							<UButton color="neutral" variant="outline" size="lg" @click="goBack"> Cancel </UButton>

							<UButton color="success" variant="solid" size="lg" :loading="adding" @click="() => onSubmit()">
								<UIcon :name="ICONS.CHECK_ROUNDED" />
								Create Product
							</UButton>
						</div>
					</div>

					<!-- Mobile Layout -->
					<div class="md:hidden flex flex-col gap-2">
						<UButton color="success" size="md" class="w-full" :loading="adding" @click="() => onSubmit()">
							<UIcon :name="ICONS.CHECK_ROUNDED" class="w-4 h-4" />
							<span class="text-sm">Create Product</span>
						</UButton>
						<div class="flex gap-2">
							<UButton color="neutral" variant="soft" size="sm" class="flex-1" :loading="adding" @click="() => saveDraft()">
								<UIcon :name="ICONS.SAVE" class="w-4 h-4" />
								<span class="text-xs">Save Draft</span>
							</UButton>
							<UButton color="neutral" variant="outline" size="sm" class="flex-1" @click="goBack">
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
import { ICONS } from '~/utils/icons';

const productStore = useProductStore();
const { adding } = storeToRefs(productStore);
const formRef = ref<{ onSubmit: () => Promise<void> } | null>(null);

useHead({ title: 'Wemotoo CRM - Create Product' });

onBeforeRouteLeave(() => {
	productStore.resetNewProduct();
});

const saveDraft = async () => {
	await productStore.createProduct();
};

const onSubmit = async () => {
	if (formRef.value) {
		await formRef.value.onSubmit();
	}
};

const goBack = () => {
	useRouter().back();
};
</script>

<style scoped></style>
