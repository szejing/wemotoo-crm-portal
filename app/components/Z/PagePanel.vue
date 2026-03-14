<template>
	<UDashboardPanel :id="id" :grow="grow">
		<template #header>
			<UDashboardNavbar :title="title" :ui="{ right: 'gap-3' }">
				<template v-if="$slots.leading" #leading>
					<slot name="leading" />
				</template>
				<template v-if="$slots['navbar-right']" #right>
					<slot name="navbar-right" />
				</template>
			</UDashboardNavbar>
			<UDashboardToolbar v-if="$slots.toolbar || backTo">
				<template #left>
					<div class="py-2 space-y-2">
						<ZBackButton v-if="backTo" :fallback-to="backTo" labeled />
						<slot name="toolbar" />
					</div>
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
		id: string;
		title: string;
		/** When provided, ZBackButton is shown in the toolbar (avoids conflict with navbar burger on mobile). */
		backTo?: string;
		/** When true, the panel grows to fill available space. */
		grow?: boolean;
	}>(),
	{ grow: false },
);
</script>
