<template>
	<div class="space-y-4">
		<!-- ***** Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Status</h3>
				<ZSelectMenuMaintenanceStatus v-model:status="newMaintenance.status" class="mt-2" />
			</template>
		</UCard>

		<!-- ***** Categories ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Categories</h3>
				<ZSelectMenuCategories v-model:categories="newMaintenance.categories" />
			</template>
		</UCard>

		<!-- ***** Tags ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Tags</h3>
				<ZSelectMenuTags v-model:tags="newMaintenance.tags" />
			</template>
		</UCard>

		<!-- ***** Image Thumbnails ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Image</h3>
			</template>
			<ZDropzoneSingle :url-single="newMaintenance.thumbnail" @update:url-single="updateThumbnail" />
		</UCard>
		<!-- ***** Galleries ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Galleries</h3>
			</template>
			<ZDropzoneMultiple :urls-multiple="newMaintenance.galleries" @update:urls-multiple="updateGalleries" />
		</UCard>
	</div>
</template>

<script lang="ts" setup>
import { useMaintenanceServiceStore } from '~/stores/MaintenanceService/MaintenanceService';

const cardBg = { background: 'bg-secondary-50', shadow: 'shadow-md' };

const maintenanceServiceStore = useMaintenanceServiceStore();
const { newMaintenance } = storeToRefs(maintenanceServiceStore);

const updateThumbnail = (url: string) => {
	newMaintenance.value.thumbnail = url;
};

const updateGalleries = (urls: string[]) => {
	newMaintenance.value.galleries = urls;
};
</script>

<style scoped lang="css"></style>
