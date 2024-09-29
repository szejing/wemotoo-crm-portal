import { onBeforeUnmount, onMounted } from 'vue';

export const useDetectClickOutside = (component: any, callback: () => void) => {
	if (!component) return;
	const listener = (event: any) => {
		if (event.target !== component.value && event.composedPath().includes(component.value)) {
			return;
		}
		if (typeof callback === 'function') {
			callback();
		}
	};

	onMounted(() => {
		window.addEventListener('click', listener);
	});

	onBeforeUnmount(() => {
		window.removeEventListener('click', listener);
	});

	return { listener };
};
