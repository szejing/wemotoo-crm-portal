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
				<div class="space-y-2">
					<UFormField label="New password" name="password" required>
						<UInput
							id="password"
							v-model="state.password"
							placeholder="Password"
							:color="passwordStrengthColor"
							:type="state.showPassword ? 'text' : 'password'"
							:aria-invalid="passwordStrengthScore < 4"
							aria-describedby="password-strength"
							autocomplete="new-password"
							:ui="{ trailing: 'pe-1' }"
						>
							<template #trailing>
								<UButton
									color="neutral"
									variant="link"
									size="sm"
									:icon="state.showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
									:aria-label="state.showPassword ? 'Hide password' : 'Show password'"
									:aria-pressed="state.showPassword"
									aria-controls="password"
									@click="state.showPassword = !state.showPassword"
								/>
							</template>
						</UInput>
					</UFormField>
					<UProgress
						:color="passwordStrengthColor"
						:indicator="passwordStrengthText"
						:model-value="passwordStrengthScore"
						:max="4"
						size="sm"
					/>
					<p id="password-strength" class="text-sm font-medium">
						{{ passwordStrengthText }}. Must contain:
					</p>
					<ul class="space-y-1" aria-label="Password requirements">
						<li
							v-for="(req, index) in passwordStrength"
							:key="index"
							class="flex items-center gap-0.5"
							:class="req.met ? 'text-success' : 'text-muted'"
						>
							<UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />
							<span class="text-xs font-light">
								{{ req.text }}
								<span class="sr-only">{{ req.met ? ' - Requirement met' : ' - Requirement not met' }}</span>
							</span>
						</li>
					</ul>
				</div>
				<UFormField label="Confirm password" name="confirmPassword" required>
					<UInput v-model="state.confirmPassword" :type="state.showConfirm ? 'text' : 'password'" autocomplete="new-password" :ui="{ trailing: 'pe-1' }">
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
					<UButton block size="md" color="primary" variant="outline" type="submit" :loading="loading"> Reset password </UButton>
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

const state = reactive({
	password: '',
	confirmPassword: '',
	showPassword: false,
	showConfirm: false,
});
const loading = ref(false);

const PASSWORD_REQUIREMENTS = [
	{ regex: /.{8,}/, text: 'At least 8 characters' },
	{ regex: /\d/, text: 'At least 1 number' },
	{ regex: /[a-z]/, text: 'At least 1 lowercase letter' },
	{ regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
];

function checkPasswordStrength(str: string) {
	return PASSWORD_REQUIREMENTS.map((req) => ({ met: req.regex.test(str), text: req.text }));
}

const passwordStrength = computed(() => checkPasswordStrength(state.password));
const passwordStrengthScore = computed(() => passwordStrength.value.filter((r) => r.met).length);
const passwordStrengthColor = computed(() => {
	const score = passwordStrengthScore.value;
	if (score === 0) return 'neutral';
	if (score <= 1) return 'error';
	if (score <= 2) return 'warning';
	if (score === 3) return 'warning';
	return 'success';
});
const passwordStrengthText = computed(() => {
	const score = passwordStrengthScore.value;
	if (score === 0) return 'Enter a password';
	if (score <= 2) return 'Weak password';
	if (score === 3) return 'Medium password';
	return 'Strong password';
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	loading.value = true;
	try {
		const authStore = useAuthStore();
		const success = await authStore.confirmResetPassword(props.token, event.data.password);
		if (success) {
			navigateTo('/login');
		}
	} catch (err: any) {
		console.error(err);
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
