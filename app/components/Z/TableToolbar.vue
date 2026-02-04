<template>
	<div class="flex items-center gap-3 justify-between sm:justify-end">
		<div class="flex items-center gap-2">
			<span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.show') }}</span>
			<USelect :model-value="modelValue" :items="pageSizeOptions" size="sm" class="w-20" @update:model-value="$emit('update:modelValue', $event)" />
			<span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('common.entries') }}</span>
		</div>

		<UButton v-if="exportEnabled" variant="outline" :disabled="exporting" :loading="exporting" size="sm" @click="$emit('export')">
			<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
			{{ $t('common.export') }}
		</UButton>
	</div>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		modelValue: number;
		pageSizeOptions: number[];
		exportEnabled?: boolean;
		exporting?: boolean;
	}>(),
	{ exportEnabled: true, exporting: false },
);

defineEmits<{
	(e: 'update:modelValue', value: number): void;
	(e: 'export'): void;
}>();
</script>
