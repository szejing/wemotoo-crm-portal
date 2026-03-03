<template>
	<div class="space-y-4 max-w-md">
		<p v-if="serverErrorGeneral" class="text-sm text-error-500 dark:text-error-400" role="alert">{{ serverErrorGeneral }}</p>
		<UFormField :label="$t('components.changePassword.currentPassword')">
			<UInput
				id="current-password"
				v-model="state.old_password"
				:type="state.show_old ? 'text' : 'password'"
				:placeholder="$t('components.changePassword.currentPassword')"
				:color="fieldErrorCurrent ? 'error' : undefined"
				:ui="{ trailing: 'pe-1' }"
				@update:model-value="onFieldInput('current')"
			>
				<template v-if="state.old_password?.length" #trailing>
					<UButton
						color="neutral"
						variant="link"
						size="sm"
						:icon="state.show_old ? 'i-lucide-eye-off' : 'i-lucide-eye'"
						:aria-label="state.show_old ? $t('common.hidePassword') : $t('common.showPassword')"
						:aria-pressed="state.show_old"
						aria-controls="current-password"
						@click="state.show_old = !state.show_old"
					/>
				</template>
			</UInput>
			<p v-if="fieldErrorCurrent" class="mt-1 text-sm text-error-500 dark:text-error-400" role="alert">{{ fieldErrorCurrent }}</p>
		</UFormField>
		<div class="space-y-2">
			<UFormField :label="$t('components.changePassword.newPassword')">
				<UInput
					id="new-password"
					v-model="state.new_password"
					:placeholder="$t('components.changePassword.newPassword')"
					:color="passwordStrengthColor === 'error' || fieldErrorNew ? 'error' : passwordStrengthColor"
					:type="state.show_new ? 'text' : 'password'"
					:aria-invalid="passwordStrengthScore < 4 || !!fieldErrorNew"
					aria-describedby="new-password-strength"
					:ui="{ trailing: 'pe-1' }"
					@update:model-value="onFieldInput('new')"
				>
					<template #trailing>
						<UButton
							color="neutral"
							variant="link"
							size="sm"
							:icon="state.show_new ? 'i-lucide-eye-off' : 'i-lucide-eye'"
							:aria-label="state.show_new ? $t('common.hidePassword') : $t('common.showPassword')"
							:aria-pressed="state.show_new"
							aria-controls="new-password"
							@click="state.show_new = !state.show_new"
						/>
					</template>
				</UInput>
				<p v-if="fieldErrorNew" class="mt-1 text-sm text-error-500 dark:text-error-400" role="alert">{{ fieldErrorNew }}</p>
			</UFormField>
			<UProgress :color="passwordStrengthColor" :indicator="passwordStrengthText" :model-value="passwordStrengthScore" :max="4" size="sm" />
			<p id="new-password-strength" class="text-sm font-medium">{{ passwordStrengthText }}. {{ $t('auth.mustContain') }}</p>
			<ul class="space-y-1" :aria-label="$t('components.changePassword.passwordRequirementsAria')">
				<li v-for="(req, index) in passwordStrength" :key="index" class="flex items-center gap-0.5" :class="req.met ? 'text-success' : 'text-muted'">
					<UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />
					<span class="text-xs font-light">
						{{ req.text }}
						<span class="sr-only">{{ req.met ? $t('components.changePassword.requirementMet') : $t('components.changePassword.requirementNotMet') }}</span>
					</span>
				</li>
			</ul>
		</div>
		<UFormField :label="$t('components.changePassword.confirmNewPassword')">
			<UInput
				id="confirm-password"
				v-model="state.confirm_password"
				:type="state.show_confirm ? 'text' : 'password'"
				:placeholder="$t('components.changePassword.confirmNewPassword')"
				:color="fieldErrorConfirm ? 'error' : undefined"
				:ui="{ trailing: 'pe-1' }"
				@update:model-value="onFieldInput('confirm')"
			>
				<template v-if="state.confirm_password?.length" #trailing>
					<UButton
						color="neutral"
						variant="link"
						size="sm"
						:icon="state.show_confirm ? 'i-lucide-eye-off' : 'i-lucide-eye'"
						:aria-label="state.show_confirm ? $t('common.hidePassword') : $t('common.showPassword')"
						:aria-pressed="state.show_confirm"
						aria-controls="confirm-password"
						@click="state.show_confirm = !state.show_confirm"
					/>
				</template>
			</UInput>
			<p v-if="fieldErrorConfirm" class="mt-1 text-sm text-error-500 dark:text-error-400" role="alert">{{ fieldErrorConfirm }}</p>
		</UFormField>
		<UButton color="primary" :loading="loading" :disabled="!canSubmit" @click="onSubmit">{{ $t('components.changePassword.updatePassword') }}</UButton>
	</div>
</template>

<script lang="ts" setup>
export interface ChangePasswordPayload {
	old_password: string;
	new_password: string;
	confirm_password: string;
}

export type ChangePasswordField = 'current' | 'new' | 'confirm';

export interface ChangePasswordServerError {
	field: ChangePasswordField | null;
	message: string;
}

const props = withDefaults(
	defineProps<{
		loading?: boolean;
		serverError?: ChangePasswordServerError | null;
	}>(),
	{ serverError: null },
);

const emit = defineEmits<{
	submit: [payload: ChangePasswordPayload];
	clearError: [];
}>();

const state = reactive({
	old_password: '',
	show_old: false,
	new_password: '',
	show_new: false,
	confirm_password: '',
	show_confirm: false,
	/** Client-side validation errors set on submit attempt */
	errors: {} as Partial<Record<ChangePasswordField, string>>,
});

const { t } = useI18n();

const passwordRequirements = computed(() => [
	{ regex: /.{8,}/, textKey: 'common.atLeast8Characters' },
	{ regex: /\d/, textKey: 'common.atLeast1Number' },
	{ regex: /[a-z]/, textKey: 'common.atLeast1Lowercase' },
	{ regex: /[A-Z]/, textKey: 'common.atLeast1Uppercase' },
]);

const checkPasswordStrength = (str: string) => {
	return passwordRequirements.value.map((req) => ({ met: req.regex.test(str), text: t(req.textKey) }));
};

const passwordStrength = computed(() => checkPasswordStrength(state.new_password));
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
	if (score === 0) return t('common.enterPassword');
	if (score <= 2) return t('common.weakPassword');
	if (score === 3) return t('common.mediumPassword');
	return t('common.strongPassword');
});

const getFieldError = (field: ChangePasswordField): string | undefined => {
	return state.errors[field] ?? (props.serverError?.field === field ? props.serverError?.message : undefined);
};

const fieldErrorCurrent = computed(() => getFieldError('current'));
const fieldErrorNew = computed(() => getFieldError('new'));
const fieldErrorConfirm = computed(() => getFieldError('confirm'));

const serverErrorGeneral = computed(() => (props.serverError?.field === null && props.serverError?.message ? props.serverError.message : undefined));

const canSubmit = computed(
	() =>
		Boolean(state.old_password?.trim()) && Boolean(state.new_password?.trim()) && Boolean(state.confirm_password?.trim()) && passwordStrengthScore.value === 4,
);

const validate = (): boolean => {
	state.errors = {};
	if (!state.old_password?.trim()) {
		state.errors.current = t('validation.changePassword.currentPasswordRequired');
	}
	const minLength = 8;
	if (state.new_password.length > 0 && state.new_password.length < minLength) {
		state.errors.new = t('validation.changePassword.newPasswordMinLength');
	}
	if (state.confirm_password.length > 0 && state.new_password !== state.confirm_password) {
		state.errors.confirm = t('validation.changePassword.passwordConfirmationMismatch');
	}
	return Object.keys(state.errors).length === 0;
};

const onFieldInput = (_field: ChangePasswordField) => {
	state.errors = {};
	emit('clearError');
};

const onSubmit = () => {
	if (!validate()) return;
	emit('submit', {
		old_password: state.old_password,
		new_password: state.new_password,
		confirm_password: state.confirm_password,
	});
};
</script>

<style scoped>
::-ms-reveal {
	display: none;
}
</style>
