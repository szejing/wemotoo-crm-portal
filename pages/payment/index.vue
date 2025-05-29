<template>
	<div class="space-y-8">
		<UContainer class="space-y-4">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-8 space-y-4">
				<UButton v-for="(navigate, index) in payment_navigations" :key="index" variant="ghost" color="gray" :to="navigate.to">
					<div class="flex flex-col items-center gap-2 mx-auto text-center">
						<UIcon size="24" :name="navigate.icon" />
						<span>{{ navigate.title }}</span>
					</div>
				</UButton>
			</div>
		</UContainer>
	</div>
</template>

<script lang="ts" setup>
const payment_navigations = [
	{
		title: 'Payment Type',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/types',
	},
	{
		title: 'Payment Method',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/methods',
	},
];
</script>

<style scoped lang="postcss"></style>
