//
<template>
	//
	<div class="text-base font-nunito font-medium min-h-20">
		//
		<div :class="['mb-1', disabled ? 'text-neutral-500' : value ? (errorMessage ? 'text-red-600' : 'text-neutral-800') : '']">// {{ label }} //</div>
		//
	</div>
	//
</template>

//
<script lang="ts" setup>
// import { useField } from 'vee-validate';

// const props = defineProps({
// 	icon: String,
// 	label: String,
// 	value: String,
// 	name: String,
// 	placeHolder: String,
// 	disabled: {
// 		type: Boolean || null,
// 		default: null,
// 	},
// 	searchable: {
// 		type: Boolean || null,
// 		default: true,
// 	},
// 	multiple: {
// 		type: Boolean || null,
// 		default: false,
// 	},
// });

// const { value, errorMessage } = useField(() => props.name ?? '');

// const label = ref<string>(props.label ?? '');
// const placeHolder = ref<string>(props.placeHolder ?? label.value);
//
</script>

//
<style scoped lang="css"></style>
