<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[80%]',
		}"
	>
		<UForm :schema="UpdateProductValidation" :state="current_product" class="space-y-4" @submit="onSubmit">
			<UCard>
				<!-- *********************** General Info *********************** -->
				<ZInputProductGeneralInfo
					v-model:is-active="current_product.is_active"
					v-model:is-giftcard="current_product.is_giftcard"
					v-model:is-discountable="current_product.is_discountable"
					v-model:code="current_product.code"
					v-model:name="current_product.name"
					v-model:short-desc="current_product.short_desc"
					v-model:long-desc="current_product.long_desc"
					v-model:type="current_product.type"
					disabled-code
					:card-ui="borderless_card_ui"
				/>
				<!-- *********************** General Info *********************** -->

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<!-- ***** Status ***** -->
					<div>
						<h3>Status</h3>
						<ZSelectMenuProductStatus v-model:status="current_product.status" class="mt-2" />
					</div>

					<!-- ***** Categories ***** -->
					<div>
						<h3>Categories</h3>
						<ZSelectMenuCategories v-model:categories="current_product.categories" />
					</div>

					<!-- ***** Tags ***** -->
					<div>
						<h3>Tags</h3>
						<ZSelectMenuTags v-model:tags="current_product.tags" />
					</div>
				</div>

				<!-- *********************** Pricing *********************** -->
				<div v-for="price in current_product.price_types" :key="price.id">
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
				<ZInputProductAdditionalInfo
					:product="current_product"
					:card-ui="borderless_card_ui"
					@update_options="updateProductOptions"
					@update_variants="updateProductVariants"
				/>
				<!-- *********************** Additional Info *********************** -->

				<template #footer>
					<div class="flex-jbetween-icenter">
						<UButton color="danger" variant="ghost" @click="onDelete">Delete</UButton>

						<div class="flex-jend gap-4">
							<UButton color="neutral" variant="ghost" @click="onCancel">Cancel</UButton>
							<UButton color="primary" variant="solid" :loading="updating" type="submit">Update</UButton>
						</div>
					</div>
				</template>
			</UCard>
		</UForm>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { UpdateProductValidation } from '~/utils/schema';
import type { ProdOptionInput, Product, ProdVariantInput } from '~/utils/types/product';

type Schema = z.output<typeof UpdateProductValidation>;

const props = defineProps({
	product: {
		type: Object as PropType<Product> | undefined,
		required: true,
	},
});

const productStore = useProductStore();
const { updating } = storeToRefs(productStore);

const emit = defineEmits(['update', 'delete', 'cancel']);

const current_product = ref(props.product);

const updateProductOptions = (value: ProdOptionInput[]) => {
	current_product.value.options = value;
};

const updateProductVariants = (value: ProdVariantInput[]) => {
	current_product.value.variants = value;
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	emit('update', event.data);
};

const onCancel = () => {
	emit('cancel');
};

const onDelete = () => {
	emit('delete');
};
</script>

<style scoped lang="postcss"></style>
