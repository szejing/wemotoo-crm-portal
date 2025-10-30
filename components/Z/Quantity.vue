<template>
	<div class="quantity-control">
		<UButton
			class="h-[24px] w-[24px] p-0 block mx-auto align-middle items-center text-center pt-[4px]"
			icon="i-heroicons-minus"
			size="xs"
			color="primary"
			:variant="quantity >= 1 ? 'solid' : 'outline'"
			:trailing="false"
			:ui="{
				base: 'disabled:cursor-not-allowed ',
				rounded: 'rounded-full',
			}"
			:disabled="quantity === 0"
			@click="decreaseQuantity"
		/>
		<span class="quantity-value">{{ quantity }}</span>
		<UButton
			class="h-[24px] w-[24px] p-0 block mx-auto align-middle items-center text-center pt-[4px]"
			icon="i-heroicons-plus"
			size="xs"
			color="primary"
			variant="solid"
			:trailing="false"
			:ui="{
				base: 'disabled:cursor-not-allowed',
				rounded: 'rounded-full',
			}"
			@click="increaseQuantity"
		/>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	quantity: {
		type: Number,
		required: true,
	},
});

const emit = defineEmits(['update:quantity']);

const decreaseQuantity = () => {
	if (props.quantity > 1) {
		emit('update:quantity', props.quantity - 1);
	}
};

const increaseQuantity = () => {
	emit('update:quantity', props.quantity + 1);
};
</script>

<style scoped>
.quantity-control {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.quantity-value {
	width: 2rem;
	text-align: center;
	font-weight: 500;
}
</style>
