<template>
	<UDropdownMenu
		:items="items"
		:content="{ align: 'center', collisionPadding: 12 }"
		:ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
	>
		<UButton
			v-bind="{
				...user,
				label: collapsed ? undefined : user?.name,
				trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
			}"
			color="neutral"
			variant="ghost"
			block
			:square="collapsed"
			class="data-[state=open]:bg-elevated"
			:ui="{
				trailingIcon: 'text-dimmed',
			}"
		/>

		<template #chip-leading="{ item }">
			<div class="inline-flex items-center justify-center shrink-0 size-5">
				<span
					class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
					:style="{
						'--chip-light': `var(--color-${(item as any).chip}-500)`,
						'--chip-dark': `var(--color-${(item as any).chip}-400)`,
					}"
				/>
			</div>
		</template>
	</UDropdownMenu>
</template>

<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui';
import { LOCALE_STORAGE_KEY } from '~/utils/constants/i18n';

defineProps<{
	collapsed?: boolean;
}>();

const { t, locale, setLocale } = useI18n();
const colorMode = useColorMode();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const switchLocale = (newLocale: string) => {
	if (import.meta.client) {
		try {
			localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
		} catch {
			// ignore
		}
		setLocale(newLocale);
	}
};

const items = computed<DropdownMenuItem[][]>(() => [
	[
		{
			type: 'label',
			label: user.value?.name,
		},
		{
			label: t('nav.settings'),
			icon: 'i-lucide-settings',
			to: '/settings',
		},
	],
	[
		{
			label: t('nav.appearance'),
			icon: 'i-lucide-sun-moon',
			children: [
				{
					label: t('nav.light'),
					icon: 'i-lucide-sun',
					type: 'checkbox',
					checked: colorMode.value === 'light',
					onSelect(e: Event) {
						e.preventDefault();

						colorMode.preference = 'light';
					},
				},
				{
					label: t('nav.dark'),
					icon: 'i-lucide-moon',
					type: 'checkbox',
					checked: colorMode.value === 'dark',
					onUpdateChecked(checked: boolean) {
						if (checked) {
							colorMode.preference = 'dark';
						}
					},
					onSelect(e: Event) {
						e.preventDefault();
					},
				},
			],
		},
	],
	[
		{
			label: t('common.language'),
			icon: 'i-lucide-languages',
			children: [
				{
					label: t('common.english'),
					icon: locale === 'en' ? 'i-lucide-check' : undefined,
					onSelect(e: Event) {
						e.preventDefault();
						switchLocale('en');
					},
				},
				{
					label: t('common.bahasaMelayu'),
					icon: locale === 'ms' ? 'i-lucide-check' : undefined,
					onSelect(e: Event) {
						e.preventDefault();
						switchLocale('ms');
					},
				},
			],
		},
	],
	[
		{
			label: t('nav.logOut'),
			icon: 'i-lucide-log-out',
			onSelect: async () => {
				await authStore.logout();
				navigateTo('/login');
			},
		},
	],
]);
</script>

<style></style>
