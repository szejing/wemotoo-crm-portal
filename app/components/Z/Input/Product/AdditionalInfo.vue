<template>
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
							<h3 class="text-lg font-semibold text-neutral-900">{{ $t('components.productUpdate.maintenanceSettings') }}</h3>
						</div>
						<p class="text-sm text-neutral-500 mt-1">{{ $t('components.productUpdate.configureBookingRequirements') }}</p>
					</div>
					<UTooltip :text="$t('components.productUpdate.setUpMaintenanceTooltip')" :popper="{ placement: 'left' }">
						<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-4 h-4 cursor-help shrink-0" />
					</UTooltip>
				</div>

				<div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
					<div class="flex items-start gap-3">
						<UIcon :name="ICONS.INFO" class="text-orange-600 w-5 h-5 mt-0.5 shrink-0" />
						<div>
							<h4 class="text-sm font-medium text-orange-900">{{ $t('components.productUpdate.maintenanceInformation') }}</h4>
							<p class="text-xs text-orange-700 mt-1">
								{{ $t('components.productUpdate.addMaintenanceInformation') }}
							</p>
						</div>
					</div>
				</div>

				<ZInputProductMaintenance v-model:metadata="product.metadata" @update:product-metadata="updateProductMetadata" />
			</div>
		</template>

		<template #variants>
			<div class="space-y-6 pt-4">
				<!-- Header Section -->
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-5 h-5" />
							<h3 class="text-lg font-semibold text-neutral-900">{{ $t('components.productUpdate.productVariants') }}</h3>
						</div>
						<p class="text-sm text-neutral-500 mt-1">{{ $t('components.productUpdate.createVariationsOfProduct') }}</p>
					</div>
					<UTooltip
						:text="$t('components.productUpdate.variantsTooltip')"
						:popper="{ placement: 'left' }"
					>
						<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-4 h-4 cursor-help shrink-0" />
					</UTooltip>
				</div>

				<!-- Info Banner -->
				<div class="bg-linear-to-r from-primary-50 via-purple-50 to-blue-50 border-2 border-primary-200 rounded-xl p-5">
					<div class="flex items-start gap-4">
						<div class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
							<UIcon :name="ICONS.LIGHTBULB" class="text-primary-600 w-5 h-5" />
						</div>
						<div class="flex-1">
							<h4 class="text-sm font-semibold text-neutral-900 mb-1">{{ $t('components.productUpdate.howProductVariantsWork') }}</h4>
							<p class="text-xs text-neutral-700 leading-relaxed mb-3">
								{{ $t('components.productUpdate.createProductVariantsTwoSteps') }}
							</p>
							<div class="flex flex-wrap gap-3 text-xs">
								<div class="flex items-center gap-1.5 text-neutral-600">
									<span class="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">1</span>
									<span>{{ $t('components.productUpdate.defineOptionsAndValues') }}</span>
								</div>
								<div class="flex items-center gap-1.5 text-neutral-600">
									<span class="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold">2</span>
									<span>{{ $t('components.productUpdate.generateCombinations') }}</span>
								</div>
								<div class="flex items-center gap-1.5 text-neutral-600">
									<span class="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">3</span>
									<span>{{ $t('components.productUpdate.customizeEachVariant') }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Example Preview (if no options yet) -->
				<div v-if="!product.options || product.options.length === 0" class="bg-white border-2 border-dashed border-neutral-300 rounded-xl p-6">
					<div class="flex flex-col sm:flex-row gap-6">
						<div class="flex-1">
							<h5 class="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
								<UIcon :name="ICONS.SPARKLES" class="w-4 h-4 text-amber-500" />
								{{ $t('components.productUpdate.exampleTShirtVariants') }}
							</h5>
							<div class="space-y-3 text-xs">
								<div>
									<p class="font-medium text-neutral-700 mb-1.5">{{ $t('components.productUpdate.optionsYouMightDefine') }}</p>
									<div class="flex flex-wrap gap-2">
										<span class="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">Size: S, M, L, XL</span>
										<span class="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200">Color: Red, Blue, Black</span>
									</div>
								</div>
								<div>
									<p class="font-medium text-neutral-700 mb-1.5">{{ $t('components.productUpdate.resultsInVariantsLike') }}</p>
									<div class="flex flex-wrap gap-2">
										<span class="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">Red / S</span>
										<span class="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">Red / M</span>
										<span class="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">Blue / S</span>
										<span class="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs">...</span>
										<span class="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">12 {{ $t('components.productUpdate.totalVariants') }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Workflow Container -->
				<div class="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
					<div class="space-y-8">
						<!-- Step 1: Options -->
						<ZInputProductOptions v-model:options="product.options" @update:product-options="updateProductOptions" />

						<!-- Divider -->
						<div v-if="product.options && product.options.length > 0" class="relative">
							<div class="absolute inset-0 flex items-center" aria-hidden="true">
								<div class="w-full border-t border-neutral-200"></div>
							</div>
							<div class="relative flex justify-center">
								<span class="bg-white px-3 text-xs font-medium text-neutral-500">
									<UIcon :name="ICONS.ARROW_DOWN" class="w-4 h-4" />
								</span>
							</div>
						</div>

						<!-- Step 2: Variants -->
						<ZInputProductVariantList
							:options="product.options"
							:variants="product.variants"
							:product="product"
							@delete:variant="deleteProductVariant"
							@update:variants="updateProductVariants"
						/>
					</div>
				</div>
			</div>
		</template>

		<template #tax>
			<div class="space-y-4 pt-4">
				<div class="flex items-start justify-between mb-4">
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<UIcon :name="ICONS.TAX" class="text-primary-500 w-5 h-5" />
							<h3 class="text-lg font-semibold text-neutral-900">{{ $t('components.productUpdate.taxSettings') }}</h3>
						</div>
						<p class="text-sm text-neutral-500 mt-1">{{ $t('components.productUpdate.configureTaxRulesProduct') }}</p>
					</div>
					<UTooltip :text="$t('components.productUpdate.setUpTaxTooltipProduct')" :popper="{ placement: 'left' }">
						<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-4 h-4 cursor-help shrink-0" />
					</UTooltip>
				</div>

				<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div class="flex items-start gap-3">
						<UIcon :name="ICONS.INFO" class="text-blue-600 w-5 h-5 mt-0.5 shrink-0" />
						<div>
							<h4 class="text-sm font-medium text-blue-900">{{ $t('components.productUpdate.taxInformation') }}</h4>
							<p class="text-xs text-blue-700 mt-1">
								{{ $t('components.productUpdate.configureTaxSettingsProduct') }}
							</p>
						</div>
					</div>
				</div>

				<div class="text-center py-12 text-neutral-500">
					<UIcon :name="ICONS.SETTINGS_ROUNDED" class="w-12 h-12 mx-auto mb-3 text-neutral-300" />
					<p class="text-sm">{{ $t('components.productUpdate.taxConfigurationComingSoon') }}</p>
				</div>
			</div>
		</template>
	</UTabs>
</template>

<script lang="ts" setup>
import type { ProductCreate } from '~/utils/types/form/product-creation';
import type { Product, ProductOptionInput, ProductVariantInput } from '~/utils/types/product';

const props = defineProps({
	product: {
		type: Object as PropType<ProductCreate | Product>,
		required: true,
	},
});

const emit = defineEmits(['update:options', 'update:variants', 'delete:variant', 'update:metadata']);
const { t } = useI18n();

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
			label: t('components.productUpdate.maintenanceTab'),
			slot: 'maintenance',
			icon: ICONS.SETTINGS_ROUNDED,
		});
	}

	// Always add variants
	tabs.push({
		label: t('components.productUpdate.variantsTab'),
		slot: 'variants',
		icon: ICONS.LAYERS,
	});

	// Always add tax
	tabs.push({
		label: t('nav.tax'),
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
