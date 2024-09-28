<template>
	<UCard>
		<template #header>
			<h2>Additional Info</h2>
		</template>
		<UTabs :items="product_additional_info" orientation="vertical" :ui="ui_tabs">
			<template #default="{ item, selected }">
				<h4 class="text-start truncate" :class="[selected && 'text-primary-500']">{{ item.label }}</h4>
			</template>

			<template #options_variations>
				<div class="flex flex-col bg-main h-full">
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
					<h1>Options & Variations</h1>
				</div>
			</template>

			<template #shipping>
				<h1>Shipping</h1>
			</template>

			<template #tax>
				<h1>Tax</h1>
			</template>
		</UTabs>
	</UCard>
</template>

<script lang="ts" setup>
const product_additional_info = [
	{
		label: 'Options & Variations',
		slot: 'options_variations',
	},
	{
		label: 'Shipping',
		slot: 'shipping',
	},
	{
		label: 'Tax',
		slot: 'tax',
	},
];

const ui_tabs = {
	wrapper: 'flex items-start gap-4',
	container: 'relative w-full h-[450px] max-h-[450px] overflow-hidden overflow-y-auto scrollbar-hide',
	list: {
		width: 'w-80',
		tab: {
			base: 'relative inline-flex items-center justify-start flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500  ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out',
			height: 'h-12',
		},
	},
};
</script>

<style scoped lang="css"></style>
