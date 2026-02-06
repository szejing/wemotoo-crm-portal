<template>
	<NuxtLayout name="auth">
		<div class="h-screen flex justify-center">
			<div class="hidden sm:flex w-full h-full bg-main flex-col items-center justify-center">
				<img class="my-2 text-center mx-auto w-100 cursor-pointer" src="/logo/logo.png" alt="Wemotoo CRM" @click="goHome" />
			</div>
			<div class="w-full sm:w-[60%] min-h-screen px-10 flex flex-col relative">
				<div class="absolute top-10 right-10">
					<USelect :model-value="locale" :items="localeItems" size="sm" class="w-36" @update:model-value="switchLocale" />
				</div>
				<div class="flex-1 flex justify-center items-center w-full">
					<div class="w-full max-w-md flex flex-col items-center text-center">
						<h1 class="font-semibold text-4xl text-main-500 mb-2">
							{{ error.status ?? error.statusCode }}
						</h1>
						<p class="text-neutral-600 dark:text-neutral-400 text-lg mb-1">
							{{ error.statusText ?? $t('error.pageTitle') }}
						</p>
						<UButton color="primary" size="lg" class="button button-primary-solid" @click="goHome">
							{{ $t('error.goBackHome') }}
						</UButton>
					</div>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app';
import { LOCALE_STORAGE_KEY } from '~/utils/constants/i18n';

const props = defineProps<{ error: NuxtError }>();
const { t, locale, setLocale } = useI18n();

const localeItems = computed(() => [
	{ label: t('common.english'), value: 'en' },
	{ label: t('common.bahasaMelayu'), value: 'ms' },
]);

const switchLocale = (newLocale: string) => {
	if (import.meta.client) {
		try {
			localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
		} catch {
			// ignore
		}
		setLocale(newLocale as 'en' | 'ms');
	}
};

const goHome = () => {
	clearError({ redirect: '/' });
};
</script>
