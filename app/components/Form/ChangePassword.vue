<template>
	<div class="space-y-4 max-w-md">
		<UFormField label="Current password">
			<UInput v-model="state.old_password" :type="state.show_old ? 'text' : 'password'" placeholder="Current password">
				<template v-if="state.old_password?.length" #trailing>
					<UButton
						color="neutral"
						variant="link"
						size="sm"
						:icon="state.show_old ? 'i-lucide-eye-off' : 'i-lucide-eye'"
						:aria-label="state.show_old ? 'Hide password' : 'Show password'"
						:aria-pressed="state.show_old"
						aria-controls="password"
						@click="state.show_old = !state.show_old"
					/>
				</template>
			</UInput>
		</UFormField>
		<UFormField label="New password">
			<UInput v-model="state.new_password" :type="state.show_new ? 'text' : 'password'" placeholder="New password">
				<template v-if="state.new_password?.length" #trailing>
					<UButton
						color="neutral"
						variant="link"
						size="sm"
						:icon="state.show_new ? 'i-lucide-eye-off' : 'i-lucide-eye'"
						:aria-label="state.show_new ? 'Hide password' : 'Show password'"
						:aria-pressed="state.show_new"
						aria-controls="password"
						@click="state.show_new = !state.show_new"
					/>
				</template>
			</UInput>
		</UFormField>
		<UFormField label="Confirm new password">
			<UInput v-model="state.confirm_password" :type="state.show_confirm ? 'text' : 'password'" placeholder="Confirm new password">
				<template v-if="state.confirm_password?.length" #trailing>
					<UButton
						color="neutral"
						variant="link"
						size="sm"
						:icon="state.show_confirm ? 'i-lucide-eye-off' : 'i-lucide-eye'"
						:aria-label="state.show_confirm ? 'Hide password' : 'Show password'"
						:aria-pressed="state.show_confirm"
						aria-controls="password"
						@click="state.show_confirm = !state.show_confirm"
					/>
				</template>
			</UInput>
		</UFormField>
		<UButton color="primary" :loading="loading" :disabled="!canSubmit" @click="onSubmit"> Update password </UButton>
	</div>
</template>

<script lang="ts" setup>
export interface ChangePasswordPayload {
	old_password: string;
	new_password: string;
	confirm_password: string;
}

const props = defineProps<{
	loading?: boolean;
}>();

const emit = defineEmits<{
	submit: [payload: ChangePasswordPayload];
}>();

const state = reactive({
	old_password: '',
	show_old: false,
	new_password: '',
	show_new: false,
	confirm_password: '',
	show_confirm: false,
});

const canSubmit = computed(
	() =>
		Boolean(state.old_password?.trim()) &&
		Boolean(state.new_password?.trim()) &&
		Boolean(state.confirm_password?.trim()) &&
		state.new_password === state.confirm_password,
);

function onSubmit() {
	if (!canSubmit.value) return;
	emit('submit', {
		old_password: state.old_password,
		new_password: state.new_password,
		confirm_password: state.confirm_password,
	});
}
</script>
