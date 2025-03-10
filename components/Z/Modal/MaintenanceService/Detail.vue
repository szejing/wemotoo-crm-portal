<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[80%]',
		}"
	>
		<UCard>
			<template #header><h3>Update Maintenance Service</h3></template>
			<UForm :schema="UpdateProductValidation" :state="current_maintenanceService" class="space-y-4" @submit="onSubmit">
				<!-- *********************** General Info *********************** -->
				<ZInputMaintenanceGeneralInfo
					v-model:is-active="current_maintenanceService.is_active"
					v-model:is-discountable="current_maintenanceService.is_discountable"
					v-model:code="current_maintenanceService.code"
					v-model:name="current_maintenanceService.name"
					v-model:short-desc="current_maintenanceService.short_desc"
					v-model:long-desc="current_maintenanceService.long_desc"
					disabled-code
					:card-ui="borderless_card_ui"
				/>
				<!-- *********************** General Info *********************** -->

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<!-- ***** Status ***** -->
					<div>
						<h3>Status</h3>
						<ZSelectMenuMaintenanceStatus v-model:status="current_maintenanceService.status" class="mt-2" />
					</div>

					<!-- ***** Categories ***** -->
					<div>
						<h3>Categories</h3>
						<ZSelectMenuCategories v-model:categories="current_maintenanceService.categories" />
					</div>

					<!-- ***** Tags ***** -->
					<div>
						<h3>Tags</h3>
						<ZSelectMenuTags v-model:tags="current_maintenanceService.tags" />
					</div>
				</div>

				<!-- *********************** Pricing *********************** -->
				<div v-for="price in current_maintenanceService.price_types" :key="price.id">
					<ZInputPricing
						v-model:orig-sell-price.number="price.orig_sell_price"
						v-model:cost-price.number="price.cost_price"
						v-model:sale-price.number="price.sale_price"
						v-model:currency-code="price.currency_code"
						:card-ui="borderless_card_ui"
					/>
				</div>
				<!-- *********************** Pricing *********************** -->

				<!-- *********************** Additional Info *********************** -->
				<!-- <ZInputProductAdditionalInfo
					:product="current_maintenanceService"
					:card-ui="borderless_card_ui"
					@update_options="updateProductOptions"
					@update_variants="updateProductVariants"
				/> -->
				<!-- *********************** Additional Info *********************** -->

				<div class="flex-jend gap-4">
					<UButton color="neutral" variant="ghost" @click="onCancel">Cancel</UButton>
					<UButton color="primary" variant="solid" :loading="updating" type="submit">Update</UButton>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { useMaintenanceServiceStore } from '~/stores/MaintenanceService/MaintenanceService';
import { UpdateProductValidation } from '~/utils/schema';
import type { MaintenanceService } from '~/utils/types/maintenance-service';

type Schema = z.output<typeof UpdateProductValidation>;

const props = defineProps({
	maintenanceService: {
		type: Object as PropType<MaintenanceService> | undefined,
		required: true,
	},
});

const maintenanceServiceStore = useMaintenanceServiceStore();
const { updating } = storeToRefs(maintenanceServiceStore);

const emit = defineEmits(['update', 'cancel']);

const { maintenanceService: current_maintenanceService } = toRefs(props);

// const updateMaintenanceServiceOptions = (value: any) => {
// 	current_maintenanceService.value.options = value;
// };

// const updateMaintenanceServiceVariants = (value: any) => {
// 	current_maintenanceService.value.variants = value;
// };

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	emit('update', event.data);
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style></style>
