<template>
	<UCard
		:ui="{
			body: {
				base: '',
				background: '',
				padding: 'px-4 py-1',
			},
		}"
	>
		<div class="flex-jbetween-icenter">
			<!-- <h4>{{ prodVariant.id }}</h4> -->

			<div>
				<h4>{{ values }}</h4>
				<h5 v-if="prodVariant.price_types && prodVariant.price_types.length > 0">
					{{ prodVariant.price_types[0].currency_code }} {{ formatCurrency((prodVariant.price_types[0].orig_sell_price ?? 0) * 100) }}
				</h5>
			</div>

			<UButton variant="ghost" class="flex-none" square :icon="ICONS.VERTICAL_ELLIPSIS" size="sm" color="danger" @click="viewVariant" />
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import type { ProdVariantInput } from '~/utils/types/product';

const props = defineProps<{ variant: ProdVariantInput | undefined }>();
const emit = defineEmits(['update:productvariant', 'view:productvariant']);

const prodVariant = computed({
	get() {
		return props.variant ?? [];
	},
	set(value) {
		emit('update:productvariant', value);
	},
});

const values = computed(() => {
	return prodVariant.value.options?.map((option) => option.values?.map((value) => value.value)).join(' · ');
});

const viewVariant = () => {
	emit('view:productvariant', prodVariant.value);
};
</script>

<style scoped lang="css">
h4 {
	@apply font-bold;
}

h5 {
	@apply font-medium text-sm text-main;
}
</style>
