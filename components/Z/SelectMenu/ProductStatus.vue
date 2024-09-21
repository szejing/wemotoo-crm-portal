<template>
	<UFormGroup name="status" class="mt-2">
		<USelectMenu v-model="status" :options="options_product_status" size="md" value-attribute="value" option-attribute="name" />
	</UFormGroup>
</template>

<script lang="ts" setup>
import { options_product_status } from '~/utils/options';

const status = ref(options_product_status[0].value);
</script>

<style></style>
