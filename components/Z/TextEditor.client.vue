<template>
	<QuillEditor
		v-model:content="text"
		content-type="html"
		theme="snow"
		:options="{
			placeholder: placeholder,
		}"
		class="quil-editor"
		toolbar="full"
	/>
</template>

<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const props = defineProps<{
	value: any;
	placeholder?: string;
}>();

const emit = defineEmits(['update:value']);
const text = computed({
	get() {
		return props.value;
	},
	set(value) {
		emit('update:value', value);
	},
});
</script>

<style scoped lang="css"></style>
