<template>
	<div :class="[wrapper]">
		<div :class="[item?.title, 'flex justify-between items-center']" @click="toggleCollapse">
			<div class="flex items-center gap-4">
				<UIcon :name="navigate.icon" class="w-5 h-5" />
				{{ navigate.title }}
			</div>
			<UIcon :class="['w-5 h-5', { 'rotate-90': props.collapsed }]" :name="ICONS.CHEVRON_RIGHT" />
		</div>
		<transition name="slide-fade">
			<div v-if="props.collapsed" class="space-y-2 mt-2 wrapper-border">
				<slot name="content"></slot>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import type { Navigation } from '~/utils/types/navigation';

interface Item {
	icon: string;
	title: string;
}

const props = defineProps({
	id: {
		type: Number,
		required: true,
	},
	wrapper: {
		type: String,
		default: 'w-full flex flex-col',
	},
	container: {
		type: String,
		default: 'w-full flex flex-col',
	},
	navigate: {
		type: Object as PropType<Navigation>,
		required: true,
	},
	item: {
		type: Object as PropType<Item>,
	},
	collapsed: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits(['toggle']);
const toggleCollapse = () => {
	emit('toggle', props.id);
};
</script>

<style scoped lang="css">
.rotate-90 {
	transform: rotate(90deg);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateY(-20px);
	opacity: 0;
}

.wrapper-border {
	@apply border-b-[1px] border-secondary-400 pb-2;
}
</style>
