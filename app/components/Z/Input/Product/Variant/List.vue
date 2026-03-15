<template>
	<div v-if="validVariations.length > 0 && variantRows.length > 0" class="space-y-4">
		<h4 class="text-sm font-semibold text-neutral-900">{{ $t('components.variantList.title') }}</h4>

		<!-- Apply to All row -->
		<div class="flex items-center gap-3 mb-2">
			<UInput
				v-model="applyAll.price"
				:placeholder="$t('components.variantList.pricePlaceholder')"
				type="number"
				size="sm"
				class="max-w-44"
				:ui="{ base: 'ps-12' }"
			>
				<template #leading>
					<span class="text-xs text-neutral-400">{{ currencyCode }}</span>
				</template>
			</UInput>
			<!-- <UInput v-model="applyAll.stock" :placeholder="$t('components.variantList.stockPlaceholder')" type="number" size="sm" class="max-w-36" /> -->
			<UButton color="primary" variant="soft" size="sm" @click="applyToAll">
				{{ $t('components.variantList.applyToAll') }}
			</UButton>
		</div>

		<!-- Variants Table -->
		<div class="border border-neutral-200 rounded-lg overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-neutral-50 border-b border-neutral-200">
					<tr>
						<th v-for="variation in validVariations" :key="'header-' + variation.name" class="text-left px-3 py-2 text-xs font-semibold text-neutral-700">
							<div class="flex items-center gap-1">
								<span class="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
								{{ variation.name }}
							</div>
						</th>
						<th class="text-left px-3 py-2 text-xs font-semibold text-neutral-700">
							<span class="text-red-500">*</span> {{ $t('components.variantList.price') }}
						</th>
						<!-- <th class="text-left px-3 py-2 text-xs font-semibold text-neutral-700">
							<span class="text-red-500">*</span> {{ $t('components.variantList.stock') }}
							<UTooltip :text="$t('components.variantList.stockTooltip')">
								<UIcon :name="ICONS.HELP" class="w-3.5 h-3.5 text-neutral-400 inline-block" />
							</UTooltip>
						</th> -->
					</tr>
				</thead>
				<tbody>
					<template v-for="(row, rowIdx) in variantRows" :key="row.key">
						<tr class="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50">
							<!-- Single variation -->
							<template v-if="validVariations.length === 1">
								<td class="px-3 py-2 text-neutral-900 font-medium">
									{{ row.optionLabels[0] }}
								</td>
							</template>
							<!-- Two variations with rowspan grouping -->
							<template v-else>
								<td v-if="isFirstInGroup(rowIdx)" :rowspan="groupSize" class="px-3 py-2 text-neutral-900 font-medium align-top border-r border-neutral-100">
									{{ row.optionLabels[0] }}
								</td>
								<td class="px-3 py-2 text-neutral-700">
									{{ row.optionLabels[1] }}
								</td>
							</template>

							<!-- Price -->
							<td class="px-3 py-2 align-top">
								<UFormField
									v-slot="{ error }"
									:name="`variants.${rowIdx}.price_types.0.orig_sell_price`"
									:label="undefined"
									class="[&_.ui-form-field-label]:sr-only"
								>
									<div class="flex flex-col gap-0.5">
										<UInput
											v-model.number="row.variant.price_types![0]!.orig_sell_price"
											type="number"
											size="sm"
											class="max-w-44"
											:ui="{ base: 'ps-12' }"
											:trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined"
											@update:model-value="emitVariants"
										>
											<template #leading>
												<span class="text-xs text-neutral-400">{{ currencyCode }}</span>
											</template>
										</UInput>
									</div>
								</UFormField>
							</td>

							<!-- Stock -->
							<!-- <td class="px-3 py-2">
								<UInput v-model.number="row.variant.inventory_quantity" type="number" size="sm" class="max-w-28" @update:model-value="emitVariants" />
							</td> -->
						</tr>
					</template>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { ProductCreate } from '~/utils/types/form/product-creation';
import type { Product, ProductVariantInput } from '~/utils/types/product';
import type { ProductOptionInput } from '~/utils/types/product-option';
import type { ProductVariationInput } from '~/utils/types/product-variation';

const props = defineProps<{
	product: Product | ProductCreate;
	variations: ProductVariationInput[] | undefined;
	variants: ProductVariantInput[] | undefined;
}>();

const emit = defineEmits(['update:variants', 'delete:variant']);

const applyAll = reactive({
	price: undefined as number | undefined,
	stock: undefined as number | undefined,
});

type VariantRow = {
	key: string;
	optionLabels: string[];
	options: ProductOptionInput[];
	variant: ProductVariantInput;
};

const variantRows = ref<VariantRow[]>([]);

const validVariations = computed(() => {
	return (props.variations ?? []).filter((v) => v.name.trim() !== '' && v.options.some((o) => o.value.trim() !== ''));
});

const validOptions = (variation: ProductVariationInput) => {
	return variation.options.filter((o) => o.value.trim() !== '');
};

const groupSize = computed(() => {
	const second = validVariations.value[1];
	if (validVariations.value.length < 2 || !second) return 1;
	return validOptions(second).length;
});

const isFirstInGroup = (rowIdx: number) => {
	if (validVariations.value.length < 2) return true;
	return rowIdx % groupSize.value === 0;
};

const currencyCode = computed(() => {
	return props.product.price_types?.[0]?.currency_code ?? 'MYR';
});

const createDefaultVariant = (name: string, options: ProductOptionInput[]): ProductVariantInput => {
	const basePrice = props.product.price_types?.[0];
	return {
		name,
		variant_code: props.product.code ? `${props.product.code}_${name}` : name,
		product_code: props.product.code,
		options,
		inventory_quantity: 0,
		price_types: [
			{
				orig_sell_price: basePrice?.orig_sell_price ?? 0,
				cost_price: basePrice?.cost_price ?? 0,
				sale_price: basePrice?.sale_price ?? 0,
				currency_code: basePrice?.currency_code ?? 'MYR',
			},
		],
	};
};

const emitVariants = () => {
	const variants = variantRows.value.map((row) => JSON.parse(JSON.stringify(row.variant)));
	emit('update:variants', variants);
};

// Rebuild variant rows when variations change, preserving existing variant data
watch(
	validVariations,
	(vars) => {
		if (vars.length === 0) {
			variantRows.value = [];
			emitVariants();
			return;
		}

		const oldMap = new Map<string, VariantRow>();
		for (const row of variantRows.value) {
			oldMap.set(row.key, row);
		}

		const propsMap = new Map<string, ProductVariantInput>();
		(props.variants ?? []).forEach((v) => {
			if (v.name) propsMap.set(v.name, v);
		});

		const newRows: VariantRow[] = [];
		const first = vars[0];
		const second = vars[1];

		if (!first) return;

		if (vars.length === 1) {
			for (const opt of validOptions(first)) {
				const key = opt.value;
				const existing = oldMap.get(key);
				if (existing) {
					newRows.push(existing);
				} else {
					const propsVariant = propsMap.get(key);
					newRows.push({
						key,
						optionLabels: [opt.value],
						options: [{ variation_id: first.id, value: opt.value }],
						variant: propsVariant ? JSON.parse(JSON.stringify(propsVariant)) : createDefaultVariant(key, [{ variation_id: first.id, value: opt.value }]),
					});
				}
			}
		} else if (second) {
			for (const opt1 of validOptions(first)) {
				for (const opt2 of validOptions(second)) {
					const key = `${opt1.value}_${opt2.value}`;
					const existing = oldMap.get(key);
					if (existing) {
						newRows.push(existing);
					} else {
						const propsVariant = propsMap.get(key);
						const options: ProductOptionInput[] = [
							{ variation_id: first.id, value: opt1.value },
							{ variation_id: second.id, value: opt2.value },
						];
						newRows.push({
							key,
							optionLabels: [opt1.value, opt2.value],
							options,
							variant: propsVariant ? JSON.parse(JSON.stringify(propsVariant)) : createDefaultVariant(key, options),
						});
					}
				}
			}
		}

		variantRows.value = newRows;
		emitVariants();
	},
	{ immediate: true, deep: true },
);

const applyToAll = () => {
	for (const row of variantRows.value) {
		if (applyAll.price !== undefined && applyAll.price !== null) {
			if (row.variant.price_types?.[0]) {
				row.variant.price_types[0].orig_sell_price = applyAll.price;
			}
		}
		if (applyAll.stock !== undefined && applyAll.stock !== null) {
			row.variant.inventory_quantity = applyAll.stock;
		}
	}
	emitVariants();
};
</script>
