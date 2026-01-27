<template>
	<UForm :schema="ResetPasswordValidation" :state="state" class="space-y-4" @submit="onSubmit" @error="onError">
		<UCard variant="outline">
			<template #header>
				<div>
					<div class="flex sm:hidden w-full">
						<NuxtImg class="my-2 mx-auto w-full cursor-pointer rounded-sm" src="/logo/logo.png" alt="logo" />
					</div>
					<h1 class="text-center">Reset Password</h1>
					<p class="text-center text-sm text-muted mt-1">Enter your new password below.</p>
				</div>
			</template>

			<div class="flex flex-col gap-2">
				<UFormField label="New password" name="password" required>
					<UInput v-model="state.password" :type="state.showPassword ? 'text' : 'password'" autocomplete="new-password">
						<template v-if="state.password?.length" #trailing>
							<UButton
								color="neutral"
								variant="link"
								size="sm"
								:icon="state.showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
								:aria-label="state.showPassword ? 'Hide password' : 'Show password'"
								@click="state.showPassword = !state.showPassword"
							/>
						</template>
					</UInput>
				</UFormField>
				<UFormField label="Confirm password" name="confirmPassword" required>
					<UInput
						v-model="state.confirmPassword"
						:type="state.showConfirm ? 'text' : 'password'"
						autocomplete="new-password"
					>
						<template v-if="state.confirmPassword?.length" #trailing>
							<UButton
								color="neutral"
								variant="link"
								size="sm"
								:icon="state.showConfirm ? 'i-lucide-eye-off' : 'i-lucide-eye'"
								:aria-label="state.showConfirm ? 'Hide password' : 'Show password'"
								@click="state.showConfirm = !state.showConfirm"
							/>
						</template>
					</UInput>
				</UFormField>
			</div>

			<template #footer>
				<div class="flex flex-col gap-2">
					<UButton block size="md" color="primary" variant="outline" type="submit" :loading="loading">
						Reset password
					</UButton>
					<NuxtLink to="/login" class="text-center text-sm text-muted hover:underline">Back to login</NuxtLink>
				</div>
			</template>
		</UCard>
	</UForm>
</template>

<script lang="ts" setup>
import { ResetPasswordValidation } from '~/utils/schema';
import type { FormSubmitEvent, FormErrorEvent } from '#ui/types';
import type { z } from 'zod';

type Schema = z.output<typeof ResetPasswordValidation>;

const props = defineProps<{ token: string }>();

const toast = useToast();
const state = reactive({
	password: '',
	confirmPassword: '',
	showPassword: false,
	showConfirm: false,
});
const loading = ref(false);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	loading.value = true;
	try {
		const { $api } = useNuxtApp();
		await $api.auth.resetPassword({ token: props.token, password: event.data.password });
		toast.add({
			title: 'Password reset',
			description: 'Your password has been updated. You can now sign in with your new password.',
			color: 'success',
		});
		navigateTo('/login');
	} catch (err: any) {
		const message = err?.message ?? 'Unable to reset password. The link may be invalid or expired.';
		toast.add({
			title: 'Reset failed',
			description: message,
			color: 'error',
		});
	} finally {
		loading.value = false;
	}
};

const onError = (event: FormErrorEvent) => {
	const firstError = event.errors[0];
	if (firstError?.name) {
		const el = document.getElementById(firstError.name);
		el?.focus();
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
};
</script>

<style scoped>
::-ms-reveal {
	display: none;
}
</style>
