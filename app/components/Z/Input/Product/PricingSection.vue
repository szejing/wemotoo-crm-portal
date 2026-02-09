<template>
	<UCard id="section-pricing" class="shadow-md scroll-mt-4">
		<template #header>
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<div class="flex items-center gap-2">
						<UIcon :name="ICONS.CURRENCY" class="text-primary-500 w-6 h-6" />
						<h2 class="text-xl font-semibold">{{ $t('components.productUpdate.pricing') }}</h2>
						<span class="text-red-500 text-sm">*</span>
					</div>
					<p class="text-sm text-neutral-500 mt-1">{{ $t('components.productUpdate.setPricesCurrency') }}</p>
				</div>
				<UTooltip :text="$t('pages.pricingTooltip')" :popper="{ placement: 'bottom' }">
					<UIcon :name="ICONS.HELP" class="text-neutral-400 hover:text-primary-500 w-5 h-5 cursor-help" />
				</UTooltip>
			</div>
		</template>

		<div class="p-4 sm:p-6 space-y-6">
			<div class="bg-green-50 border border-green-200 rounded-lg p-4">
				<div class="flex items-start gap-3">
					<UIcon :name="ICONS.INFO" class="text-green-600 w-5 h-5 mt-0.5 shrink-0" />
					<div>
						<h4 class="text-sm font-medium text-green-900">{{ $t('components.productUpdate.pricingInformation') }}</h4>
						<p class="text-xs text-green-700 mt-1">{{ $t('components.productUpdate.setPricesOptional') }}</p>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<UFormField :label="$t('components.productUpdate.currency')">
					<p class="text-xs text-neutral-500 my-1">{{ $t('components.productUpdate.currency') }}</p>
					<ZSelectMenuCurrency :currency-code="currencyCode" class="w-full" @update:currency="emit('update:currency', $event)" />
				</UFormField>

				<UFormField :label="$t('components.productUpdate.originalSellingPrice')" required>
					<p class="text-xs text-neutral-500 my-1">{{ $t('components.productUpdate.sellingPrice') }}</p>
					<UInput
						:model-value="origSellPrice"
						type="number"
						:placeholder="$t('components.productUpdate.pricePlaceholder')"
						:min="0"
						:step="0.01"
						@update:model-value="emit('update:origSellPrice', $event != null ? Number($event) : undefined)"
					/>
				</UFormField>

				<UFormField :label="$t('components.productUpdate.costPriceOptional')">
					<p class="text-xs text-neutral-500 my-1">{{ $t('components.productUpdate.costForProfit') }}</p>
					<UInput
						:model-value="costPrice"
						type="number"
						:placeholder="$t('components.productUpdate.costPricePlaceholder')"
						:min="0"
						:step="0.01"
						@update:model-value="emit('update:costPrice', $event != null ? Number($event) : undefined)"
					/>
				</UFormField>

				<UFormField :label="$t('components.productUpdate.salePriceOptional')">
					<p class="text-xs text-neutral-500 my-1">{{ $t('components.productUpdate.discountedPrice') }}</p>
					<UInput
						:model-value="salePrice"
						type="number"
						:placeholder="$t('components.productUpdate.salePricePlaceholder')"
						:min="0"
						:step="0.01"
						@update:model-value="onSalePriceInput($event)"
					/>
				</UFormField>
			</div>

			<!-- Price Preview: treat sale price 0 as undefined (no sale) -->
			<div v-if="origSellPrice" class="p-4 bg-neutral-50 rounded-lg">
				<h4 class="text-sm font-medium mb-3">{{ $t('components.productUpdate.pricePreview') }}</h4>
				<div class="flex flex-wrap items-center gap-3">
					<div v-if="effectiveSalePrice != null && effectiveSalePrice < origSellPrice" class="text-2xl font-bold text-green-600">
						{{ currencyCode }} {{ effectiveSalePrice.toFixed(2) }}
					</div>
					<div
						class="text-lg"
						:class="effectiveSalePrice != null && effectiveSalePrice < origSellPrice ? 'line-through text-neutral-500' : 'font-bold text-neutral-900'"
					>
						{{ currencyCode }} {{ Number(origSellPrice).toFixed(2) }}
					</div>
					<div v-if="effectiveSalePrice != null && effectiveSalePrice < origSellPrice" class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
						{{ Math.round(((origSellPrice - effectiveSalePrice) / origSellPrice) * 100) }}% {{ $t('components.productUpdate.percentOff') }}
					</div>
					<div v-if="effectiveSalePrice != null && effectiveSalePrice > origSellPrice" class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
						{{ $t('components.productUpdate.salePriceHigherThanOriginal') }}
						<span class="font-semibold">−{{ Math.round(((effectiveSalePrice - origSellPrice) / origSellPrice) * 100) }}%</span>
						({{ currencyCode }} +{{ (effectiveSalePrice - origSellPrice).toFixed(2) }})
					</div>
				</div>
				<div v-if="costPrice != null && origSellPrice" class="text-xs text-neutral-600 mt-2">
					{{ $t('components.productUpdate.profitMargin') }}: {{ currencyCode }} {{ (origSellPrice - costPrice).toFixed(2) }}
					({{ Math.round(((origSellPrice - costPrice) / origSellPrice) * 100) }}%)
				</div>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import { ICONS } from '~/utils/icons';

const props = defineProps<{
	currencyCode: string;
	origSellPrice?: number;
	costPrice?: number | null;
	salePrice?: number | null;
}>();

const emit = defineEmits<{
	'update:currency': [value: { code: string }];
	'update:origSellPrice': [value: number | undefined];
	'update:costPrice': [value: number | undefined];
	'update:salePrice': [value: number | undefined];
}>();

// Sale price 0 or empty => treat as undefined (no sale); avoids showing "100% OFF"
const effectiveSalePrice = computed(() => {
	const p = props.salePrice;
	return p != null && Number(p) > 0 ? Number(p) : undefined;
});

function onSalePriceInput(event: number | string | null | undefined) {
	const num = event != null && event !== '' ? Number(event) : undefined;
	emit('update:salePrice', num === 0 ? undefined : num);
}
</script>
