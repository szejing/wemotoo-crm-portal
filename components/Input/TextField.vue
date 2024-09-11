<template>
	<div class="text-base font-nunito font-medium min-h-20">
		<div
			:class="['mb-1', disabled ? 'text-neutral-500' : value ? (errorMessage ? 'text-red-600' : `${isFocus ? 'text-neutral-800' : 'text-neutral-300'}`) : '']"
		>
			{{ label }}
		</div>

		<div
			:class="[
				'text-field',
				disabled ? 'bg-gray-100 border-gray-300' : !errorMessage ? 'border-stone-300 focus-within:border-neutral-800 bg-white' : 'border-red-600 bg-rose-50',
			]"
		>
			<div class="flex justify-between items-center w-full">
				<input
					v-model="value"
					:disabled="disabled"
					:class="['w-full outline-none bg-transparent', { 'cursor-not-allowed': disabled }]"
					:type="type || 'text'"
					:placeholder="placeHolder"
					@blur="isFocus = false"
					@focus="isFocus = true"
				/>
			</div>
		</div>

		<!-- <UInput
			:icon="icon"
			:v-model="value"
			:name="props.name"
			:disabled="disabled"
			:class="['w-full outline-none bg-transparent', { 'cursor-not-allowed': disabled }]"
			:type="type || 'text'"
			:placeholder="placeHolder"
			size="md"
			@blur="isFocus = false"
			@focus="isFocus = true"
		/> -->
		<div v-if="errorMessage" class="error-message">
			{{ errorMessage }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useField } from 'vee-validate';

const props = defineProps({
	icon: String,
	label: String,
	value: String,
	type: String,
	name: String,
	placeHolder: String,
	disabled: {
		type: Boolean || null,
		default: null,
	},
});
const isFocus = ref(false);

const { value, errorMessage } = useField(() => props.name ?? '');

const label = ref<string>(props.label ?? '');
const placeHolder = ref<string>(props.placeHolder ?? label.value);
const type = ref<string>(props.type ?? 'text');
</script>

<style scoped lang="css">
.text-field {
	@apply w-full px-4 py-3 border justify-center flex flex-col rounded-md;
}

.error-message {
	@apply text-red-500 mt-1;
}
</style>
