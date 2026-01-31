<template>
	<div class="space-y-4 max-w-md">
		<UFormField label="Current password">
			<UInput
				id="current-password"
				v-model="state.old_password"
				:type="state.show_old ? 'text' : 'password'"
				placeholder="Current password"
				:ui="{ trailing: 'pe-1' }"
			>
				<template v-if="state.old_password?.length" #trailing>
					<UButton
						color="neutral"
						variant="link"
						size="sm"
						:icon="state.show_old ? 'i-lucide-eye-off' : 'i-lucide-eye'"
						:aria-label="state.show_old ? 'Hide password' : 'Show password'"
						:aria-pressed="state.show_old"
						aria-controls="current-password"
						@click="state.show_old = !state.show_old"
					/>
				</template>
			</UInput>
		</UFormField>
		<div class="space-y-2">
			<UFormField label="New password">
				<UInput
					id="new-password"
					v-model="state.new_password"
					placeholder="New password"
					:color="passwordStrengthColor"
					:type="state.show_new ? 'text' : 'password'"
					:aria-invalid="passwordStrengthScore < 4"
					aria-describedby="new-password-strength"
					:ui="{ trailing: 'pe-1' }"
				>
					<template #trailing>
						<UButton
							color="neutral"
							variant="link"
							size="sm"
							:icon="state.show_new ? 'i-lucide-eye-off' : 'i-lucide-eye'"
							:aria-label="state.show_new ? 'Hide password' : 'Show password'"
							:aria-pressed="state.show_new"
							aria-controls="new-password"
							@click="state.show_new = !state.show_new"
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
			<p id="new-password-strength" class="text-sm font-medium">
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
		<UFormField label="Confirm new password">
			<UInput
				id="confirm-password"
				v-model="state.confirm_password"
				:type="state.show_confirm ? 'text' : 'password'"
				placeholder="Confirm new password"
				:ui="{ trailing: 'pe-1' }"
			>
				<template v-if="state.confirm_password?.length" #trailing>
					<UButton
						color="neutral"
						variant="link"
						size="sm"
						:icon="state.show_confirm ? 'i-lucide-eye-off' : 'i-lucide-eye'"
						:aria-label="state.show_confirm ? 'Hide password' : 'Show password'"
						:aria-pressed="state.show_confirm"
						aria-controls="confirm-password"
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

const PASSWORD_REQUIREMENTS = [
	{ regex: /.{8,}/, text: 'At least 8 characters' },
	{ regex: /\d/, text: 'At least 1 number' },
	{ regex: /[a-z]/, text: 'At least 1 lowercase letter' },
	{ regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
];

function checkPasswordStrength(str: string) {
	return PASSWORD_REQUIREMENTS.map((req) => ({ met: req.regex.test(str), text: req.text }));
}

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
	if (score === 0) return 'Enter a password';
	if (score <= 2) return 'Weak password';
	if (score === 3) return 'Medium password';
	return 'Strong password';
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

<style scoped>
::-ms-reveal {
	display: none;
}
</style>
