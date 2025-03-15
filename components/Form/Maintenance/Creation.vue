<template>
	<UForm :schema="CreateMaintenanceValidation" :state="newMaintenance" class="space-y-4" @submit="onSubmit">
		<!-- *********************** General Info *********************** -->
		<ZInputMaintenanceGeneralInfo
			v-model:is-active="newMaintenance.is_active"
			v-model:is-discountable="newMaintenance.is_discountable"
			v-model:code="newMaintenance.code"
			v-model:name="newMaintenance.name"
			v-model:short-desc="newMaintenance.short_desc"
			v-model:long-desc="newMaintenance.long_desc"
		/>
		<!-- *********************** General Info *********************** -->

		<!-- *********************** Pricing *********************** -->
		<ZInputPricing
			v-model:orig-sell-price.number="orig_sell_price"
			v-model:cost-price.number="cost_price"
			v-model:sale-price.number="sale_price"
			v-model:currency-code="currency_code"
		/>
		<!-- *********************** Pricing *********************** -->

		<!-- *********************** Additional Info *********************** -->
		<!-- <ZInputProductAdditionalInfo :product="newMaintenance" @update_options="updateProductOptions" @update_variants="updateProductVariants" /> -->
		<!-- *********************** Additional Info *********************** -->

		<div class="flex-center text-center">
			<UButton class="w-[100%] sm:w-[50%]" size="md" color="green" variant="solid" type="submit" block :loading="adding">Submit</UButton>
		</div>
	</UForm>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { useMaintenanceServiceStore } from '~/stores/MaintenanceService/MaintenanceService';
import { MaintenanceStatus } from 'wemotoo-common';
import { CreateMaintenanceValidation } from '~/utils/schema/Maintenance/Create/MaintenanceValidation';
import type { CategoryInput } from '~/utils/types/category';
import type { PriceInput } from '~/utils/types/price';
import type { TagInput } from '~/utils/types/tag';

type Schema = z.output<typeof CreateMaintenanceValidation>;

const maintenanceServiceStore = useMaintenanceServiceStore();
const { newMaintenance, adding } = storeToRefs(maintenanceServiceStore);

onMounted(() => {
	maintenanceServiceStore.resetNewMaintenance();
});

// const updateProductOptions = (value: any) => {
// 	newMaintenance.value.options = value;
// };

// const updateProductVariants = (value: any) => {
// 	newMaintenance.value.variants = value;
// };

const currency_code = computed({
	get() {
		return newMaintenance.value.price_types?.[0]?.currency_code ?? undefined;
	},
	set(value) {
		if (newMaintenance.value.price_types && newMaintenance.value.price_types.length > 0) {
			newMaintenance.value.price_types[0].currency_code = value;
		} else {
			newMaintenance.value.price_types = [
				{ id: undefined, orig_sell_price: orig_sell_price.value, cost_price: cost_price.value, sale_price: sale_price.value, currency_code: value },
			];
		}
	},
});

const orig_sell_price = computed({
	get() {
		return newMaintenance.value.price_types?.[0]?.orig_sell_price ?? undefined;
	},
	set(value) {
		if (newMaintenance.value.price_types && newMaintenance.value.price_types.length > 0) {
			newMaintenance.value.price_types[0].orig_sell_price = value;
		} else {
			newMaintenance.value.price_types = [
				{ id: undefined, orig_sell_price: value, cost_price: cost_price.value, sale_price: sale_price.value, currency_code: currency_code.value },
			];
		}
	},
});

const cost_price = computed({
	get() {
		return newMaintenance.value.price_types?.[0]?.cost_price ?? undefined;
	},
	set(value) {
		if (newMaintenance.value.price_types && newMaintenance.value.price_types.length > 0) {
			newMaintenance.value.price_types[0].cost_price = value;
		} else {
			newMaintenance.value.price_types = [
				{ id: undefined, cost_price: value, orig_sell_price: orig_sell_price.value, sale_price: sale_price.value, currency_code: currency_code.value },
			];
		}
	},
});

const sale_price = computed({
	get() {
		return newMaintenance.value.price_types?.[0]?.sale_price ?? undefined;
	},
	set(value) {
		if (newMaintenance.value.price_types && newMaintenance.value.price_types.length > 0) {
			newMaintenance.value.price_types[0].sale_price = value;
		} else {
			newMaintenance.value.price_types = [
				{ id: undefined, sale_price: value, orig_sell_price: orig_sell_price.value, cost_price: cost_price.value, currency_code: currency_code.value },
			];
		}
	},
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	// eslint-disable-next-line @stylistic/operator-linebreak
	const { code, name, short_desc, long_desc, is_active, price_types, categories, tags, status, galleries, thumbnail } = event.data;

	// price_types
	const prodPrice: PriceInput[] = [];
	price_types?.forEach((price) => {
		prodPrice.push({
			id: undefined,
			orig_sell_price: price.orig_sell_price,
			cost_price: price.cost_price,
			sale_price: price.sale_price,
			currency_code: price.currency_code,
		});
	});

	// product categories
	const maintenanceCategories: CategoryInput[] = [];
	categories?.forEach((category) => {
		maintenanceCategories.push({
			code: category.code!,
		});
	});

	// product tags
	const maintenanceTags: TagInput[] = [];
	tags?.forEach((tag) => {
		maintenanceTags.push({
			id: tag.id!,
		});
	});

	// product options
	// const prodOptions: ProdOptionInput[] = [];
	// options?.forEach((option) => {
	// 	prodOptions.push({
	// 		id: option.id!,
	// 		name: option.name!,
	// 		values: option.values?.map((value) => {
	// 			return {
	// 				id: value.id!,
	// 				value: value.value!,
	// 			};
	// 		}),
	// 	});
	// });

	// // product variants
	// const prodVariants: ProdVariantInput[] = [];
	// variants?.forEach((variant) => {
	// 	prodVariants.push({
	// 		id: variant.id!,
	// 		name: variant.name!,
	// 		price_types: variant.price_types?.map((price) => {
	// 			return {
	// 				id: undefined,
	// 				orig_sell_price: price.orig_sell_price,
	// 				cost_price: price.cost_price,
	// 				sale_price: price.sale_price,
	// 				currency_code: price.currency_code,
	// 			};
	// 		}),
	// 		options: variant.options?.map((option) => {
	// 			return {
	// 				id: option.id!,
	// 				name: option.name!,
	// 				values: option.values?.map((value) => {
	// 					return {
	// 						id: value.id!,
	// 						value: value.value!,
	// 					};
	// 				}),
	// 			};
	// 		}),
	// 	});
	// });

	const result = await maintenanceServiceStore.addMaintenanceService({
		code,
		name,
		short_desc,
		long_desc,
		is_active,
		is_discountable: true,
		price_types: prodPrice,
		categories: maintenanceCategories,
		tags: maintenanceTags,
		status: status == MaintenanceStatus.PUBLISHED ? MaintenanceStatus.PUBLISHED : MaintenanceStatus.DRAFT,
		galleries,
		thumbnail,
		// options: prodOptions,
		// variants: prodVariants,
	});

	if (result) {
		navigateTo('/maintenance-services');
	}
};
</script>

<style scoped lang="postcss"></style>
