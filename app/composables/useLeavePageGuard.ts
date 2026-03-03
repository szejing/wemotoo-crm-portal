import { ZModalLeavePageConfirmation } from '#components';

interface UseLeavePageGuardOptions {
	onLeave?: () => void;
}

export function useLeavePageGuard(isDirty: Ref<boolean> | ComputedRef<boolean>, options?: UseLeavePageGuardOptions) {
	const overlay = useOverlay();
	const leaveConfirmed = ref(false);

	onBeforeRouteLeave((to, _from, next) => {
		if (leaveConfirmed.value || !isDirty.value) {
			options?.onLeave?.();
			next();
			return;
		}

		next(false);
		const leaveModal = overlay.create(ZModalLeavePageConfirmation, {
			props: {
				onStay: () => leaveModal.close(),
				onLeave: () => {
					leaveConfirmed.value = true;
					options?.onLeave?.();
					leaveModal.close();
					navigateTo(to.fullPath);
				},
			},
		});
		leaveModal.open();
	});
}
