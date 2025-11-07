<template>
	<UDashboardPanel id="products-brands-create">
		<template #header>
			<UDashboardNavbar title="Create Brand" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
					<FormProductBrandCreation />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup></script>

<style scoped></style>
