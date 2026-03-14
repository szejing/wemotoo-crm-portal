<template>
	<UDashboardPanel :id="id" :grow="grow">
		<template #header>
			<UDashboardNavbar :title="title" :ui="{ right: 'gap-3' }">
				<template #leading>
					<slot name="leading">
						<ZBackButton :class="backTo ? undefined : 'lg:hidden'" :fallback-to="backTo" />
					</slot>
				</template>
				<template v-if="$slots['navbar-right']" #right>
					<slot name="navbar-right" />
				</template>
			</UDashboardNavbar>
			<UDashboardToolbar v-if="$slots.toolbar">
				<template #left>
					<slot name="toolbar" />
				</template>
			</UDashboardToolbar>
		</template>
		<template #body>
			<slot />
		</template>
		<template v-if="$slots.footer" #footer>
			<slot name="footer" />
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		id: string
		title: string
		/** When provided, ZBackButton is always visible with this fallback path. Otherwise, it only shows on mobile. */
		backTo?: string
		/** When true, the panel grows to fill available space. */
		grow?: boolean
	}>(),
	{ grow: false },
);
</script>
