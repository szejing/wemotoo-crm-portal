<template>
	<div class="h-screen flex justify-center">
		<div class="hidden sm:flex w-full h-full bg-main flex-col items-center justify-center">
			<img class="my-2 text-center mx-auto w-100" src="/logo/logo.png" alt="logo" @click="navigateTo('/')" />
		</div>
		<div class="w-full sm:w-[60%] min-h-screen px-10 flex flex-col relative">
			<div class="absolute top-10 right-10">
				<USelect :model-value="locale" :items="localeItems" size="sm" class="w-36" @update:model-value="switchLocale" />
			</div>
			<div class="flex-1 flex justify-center items-center w-full">
				<div class="w-full">
					<FormLogin />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { LOCALE_STORAGE_KEY } from '~/utils/constants/i18n';

definePageMeta({ layout: 'auth' });

useHead({ title: 'Wemotoo CRM - Login' });

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
</script>

<style scoped></style>
