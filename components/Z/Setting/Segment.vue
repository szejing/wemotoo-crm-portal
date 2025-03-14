<template>
	<div>
		<div v-if="segment.setting_templs.length > 0">
			<ZSettingTemplate :templates="segment.setting_templs" />
		</div>

		<div v-for="child in segment.segment_children" :key="child.seq_no" class="space-y-3">
			<h2 class="segment-desc">{{ child.segment_desc }}</h2>
			<ZSettingTemplate :templates="child.setting_templs" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { SettingSegment } from '~/utils/types/setting-segment';

const props = defineProps({
	segment: {
		type: Object as PropType<SettingSegment>,
		required: true,
	},
});

const { segment } = toRefs(props);
</script>

<style scoped lang="postcss">
.segment-desc {
	@apply bg-slate-100 px-4 py-2 rounded-md;
}
</style>
