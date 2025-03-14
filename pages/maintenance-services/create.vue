<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="flex-jbetween-icenter">
			<h2 class="my-6">Add Maintenance Service</h2>
			<div class="block sm:hidden">
				<div class="section-menu" @click="isOpen = !isOpen">
					<UIcon :name="ICONS.MENU_OPEN_ROUNDED" class="size-7 block sm:hidden" />
				</div>
			</div>
		</div>
		<div class="wrapper-grid">
			<!-- ***** Form ***** -->
			<FormMaintenanceCreation class="col-span-3" />

			<div class="side-wrapper">
				<ZInputMaintenanceSidebar />
			</div>

			<UModal v-model="isOpen">
				<UCard
					:ui="{
						body: {
							base: 'container mx-auto',
							background: '',
							padding: 'px-4 py-5 sm:p-6',
						},
					}"
				>
					<template #header>
						<div class="flex-jbetween-icenter">
							<h2>Maintenance Status & Thumbnails</h2>
							<UIcon :name="ICONS.CLOSE_ROUNDED" class="size-7 text-secondary-600" @click="isOpen = false" />
						</div>
					</template>

					<ZInputMaintenanceSidebar />
				</UCard>
			</UModal>
		</div>
	</div>
</template>

<script lang="ts" setup>
const links = [
	{
		label: 'Maintenance Services',
		icon: ICONS.MAINTENANCE_SERVICE,
		to: '/maintenance-services',
	},
	{
		label: 'New Maintenance Service',
		to: '/create',
	},
];

const isOpen = ref(false);
</script>

<style scoped lang="postcss">
.wrapper-grid {
	@apply grid grid-cols-1 sm:grid-cols-4 gap-4;
}

.side-wrapper {
	@apply hidden sm:block col-span-1;
}

h2 {
	@apply text-secondary-600 font-normal;
}

.section-menu {
	@apply bg-white shadow-md p-2 rounded-full text-center flex justify-center items-center text-secondary-600;
}
</style>
