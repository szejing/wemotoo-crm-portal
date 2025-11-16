<template>
	<UCard :ui="cardUi">
		<UTabs :items="product_additional_info">
			<template #default="{ item }">
				<div class="flex items-center gap-2">
					<span class="text-sm font-medium hidden sm:block">{{ item.label }}</span>
				</div>
			</template>

			<template #maintenance>
				<div class="space-y-4 pt-4">
					<div class="flex items-start justify-between mb-4">
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<UIcon :name="ICONS.SETTINGS_ROUNDED" class="text-primary-500 w-5 h-5" />
								<h3 class="text-lg font-semibold text-neutral-900">Maintenance Settings</h3>
							</div>
							<p class="text-sm text-neutral-500 mt-1">Configure booking requirements, duration, and operating hours for this service.</p>
						</div>
						<UTooltip text="Set up maintenance-specific details like booking requirements and operating hours." :popper="{ placement: 'left' }">
							<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-4 h-4 cursor-help shrink-0" />
						</UTooltip>
					</div>

					<div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
						<div class="flex items-start gap-3">
							<UIcon :name="ICONS.INFO" class="text-orange-600 w-5 h-5 mt-0.5 shrink-0" />
							<div>
								<h4 class="text-sm font-medium text-orange-900">Maintenance Information</h4>
								<p class="text-xs text-orange-700 mt-1">
									Add maintenance information such as booking requirements, duration, working hours, and off days for this service.
								</p>
							</div>
						</div>
					</div>

					<ZInputProductMaintenance v-model:metadata="product.metadata" @update:product-metadata="updateProductMetadata" />
				</div>
			</template>

			<template #variants>
				<div class="space-y-4 pt-4">
					<div class="flex items-start justify-between mb-4">
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-5 h-5" />
								<h3 class="text-lg font-semibold text-neutral-900">Product Variants</h3>
							</div>
							<p class="text-sm text-neutral-500 mt-1">Add variations of this product with different options like color, size, or format.</p>
						</div>
						<UTooltip
							text="Create product variants by defining options and their values. Each combination creates a unique variant."
							:popper="{ placement: 'left' }"
						>
							<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-4 h-4 cursor-help shrink-0" />
						</UTooltip>
					</div>

					<div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
						<div class="flex items-start gap-3">
							<UIcon :name="ICONS.INFO" class="text-purple-600 w-5 h-5 mt-0.5 shrink-0" />
							<div>
								<h4 class="text-sm font-medium text-purple-900">About Variants</h4>
								<p class="text-xs text-purple-700 mt-1">
									Offer your customers different options for color, format, size, shape, etc. First define options, then auto-generate or manually add variants.
								</p>
							</div>
						</div>
					</div>

					<div class="space-y-6">
						<ZInputProductOptions v-model:options="product.options" @update:product-options="updateProductOptions" />
						<ZInputProductVariantList
							:options="product.options"
							:variants="product.variants"
							:product="product"
							@delete:variant="deleteProductVariant"
							@update:variants="updateProductVariants"
						/>
					</div>
				</div>
			</template>

			<template #tax>
				<div class="space-y-4 pt-4">
					<div class="flex items-start justify-between mb-4">
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<UIcon :name="ICONS.TAX" class="text-primary-500 w-5 h-5" />
								<h3 class="text-lg font-semibold text-neutral-900">Tax Settings</h3>
							</div>
							<p class="text-sm text-neutral-500 mt-1">Configure tax rules and rates for this product.</p>
						</div>
						<UTooltip text="Set up tax configurations specific to this product." :popper="{ placement: 'left' }">
							<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-4 h-4 cursor-help shrink-0" />
						</UTooltip>
					</div>

					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<div class="flex items-start gap-3">
							<UIcon :name="ICONS.INFO" class="text-blue-600 w-5 h-5 mt-0.5 shrink-0" />
							<div>
								<h4 class="text-sm font-medium text-blue-900">Tax Information</h4>
								<p class="text-xs text-blue-700 mt-1">
									Configure tax settings for this product. Tax rules can be applied based on your location and regulations.
								</p>
							</div>
						</div>
					</div>

					<div class="text-center py-12 text-neutral-500">
						<UIcon :name="ICONS.SETTINGS_ROUNDED" class="w-12 h-12 mx-auto mb-3 text-neutral-300" />
						<p class="text-sm">Tax configuration coming soon</p>
					</div>
				</div>
			</template>
		</UTabs>
	</UCard>
</template>

<script lang="ts" setup>
import type { ProductCreate } from '~/utils/types/form/product-creation';
import type { Product, ProductOptionInput, ProductVariantInput } from '~/utils/types/product';

const props = defineProps({
	product: {
		type: Object as PropType<ProductCreate | Product>,
		required: true,
	},
	cardUi: Object,
});

const emit = defineEmits(['update:options', 'update:variants', 'delete:variant', 'update:metadata']);

const product = computed({
	get() {
		return props.product;
	},
	set(_) {},
});

// Check if maintenance section should be shown (only for services, type_id/type === 2)
const shouldShowMaintenance = computed(() => {
	const typeId = 'type_id' in product.value ? product.value.type_id : product.value.type;
	return typeId === 2;
});

// Build tabs array with dynamic badges
const product_additional_info = computed(() => {
	const tabs = [];

	// Conditionally add maintenance for type 2 (Services)
	if (shouldShowMaintenance.value) {
		tabs.push({
			label: 'Maintenance',
			slot: 'maintenance',
			icon: ICONS.SETTINGS_ROUNDED,
		});
	}

	// Always add variants
	tabs.push({
		label: 'Variants',
		slot: 'variants',
		icon: ICONS.LAYERS,
	});

	// Always add tax
	tabs.push({
		label: 'Tax',
		slot: 'tax',
		icon: ICONS.TAX,
	});

	return tabs;
});

// Event handlers
const updateProductOptions = (value: ProductOptionInput[]) => {
	emit('update:options', value);
};

const updateProductVariants = (value: ProductVariantInput[]) => {
	emit('update:variants', value);
};

const deleteProductVariant = (value: ProductVariantInput) => {
	emit('delete:variant', value);
};

const updateProductMetadata = (value: Record<string, unknown>) => {
	emit('update:metadata', value);
};
</script>

<style scoped>
/* Smooth transitions for tab content */
:deep(.ui-tabs-container) {
	transition: all 0.2s ease-out;
}

/* Improve scrollbar appearance if content overflows */
:deep(.ui-tabs-container) {
	scrollbar-width: thin;
	scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}

:deep(.ui-tabs-container)::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}

:deep(.ui-tabs-container)::-webkit-scrollbar-track {
	background: transparent;
}

:deep(.ui-tabs-container)::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.1);
	border-radius: 3px;
}

:deep(.ui-tabs-container)::-webkit-scrollbar-thumb:hover {
	background-color: rgba(0, 0, 0, 0.2);
}
</style>
