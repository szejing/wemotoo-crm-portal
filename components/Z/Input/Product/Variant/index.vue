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
				<h4>{{ values?.join(' · ') }}</h4>
				<h5 v-if="prodVariant.prices && prodVariant.prices.length > 0">
					{{ prodVariant.prices[0].currency }} {{ formatCurrency((prodVariant.prices[0].origSellPrice ?? 0) * 100) }}
				</h5>
			</div>

			<UButton variant="ghost" class="flex-none" square icon="i-material-symbols-more-vert" size="sm" color="danger" @click="viewVariant" />
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import type { ProductVariant } from '~/utils/types/product-variant';

const props = defineProps<{ variant: ProductVariant | undefined }>();
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
	return prodVariant.value.options?.map((option) => option.values[0]);
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
