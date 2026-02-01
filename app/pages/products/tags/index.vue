<template>
	<UDashboardPanel id="products-tags">
		<template #header>
			<UDashboardNavbar title="Tags" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>

				<template #right>
					<div class="flex items-center gap-3">
						<UButton color="success" @click="navigateTo('/products/tags/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="w-4 h-4" />
							Create
						</UButton>
					</div>
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<ZSectionFilterTags />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<div class="space-y-6">
				<div class="flex flex-row sm:items-center justify-between sm:justify-end gap-4">
					<!-- Page Size -->
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-600 dark:text-gray-400">Show</span>
						<USelect v-model="filter.page_size" :items="options_page_size" size="sm" class="w-20" @update:model-value="tagsStore.updatePageSize" />
						<span class="text-sm text-gray-600 dark:text-gray-400">entries</span>
					</div>

					<UButton variant="outline" :disabled="exporting" :loading="exporting" size="sm" @click="exportTags">
						<UIcon :name="ICONS.EXCEL" class="w-4 h-4" />
						Export
					</UButton>
				</div>

				<UTable :data="rows" :columns="tag_columns" :loading="loading" @select="selectTag">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.ADDITIONAL" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">No tags found.</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">Try adjusting your filters to see more results.</p>
						</div>
					</template>
				</UTable>

				<!-- Pagination  -->
				<div v-if="tags.length > 0" class="section-pagination">
					<UPagination v-model="filter.current_page" :items-per-page="filter.page_size" :total="total_tags" @update:page="updatePage" />
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalTagDetail } from '#components';
import { tag_columns } from '~/utils/table-columns';
import type { Tag } from '~/utils/types/tag';
import { options_page_size } from '~/utils/options';
import type { TableRow } from '@nuxt/ui';

const overlay = useOverlay();
const tagsStore = useProductTagStore();
await tagsStore.getTags();

useHead({ title: 'Wemotoo CRM - Tags' });

const { loading, tags, total_tags, filter, exporting } = storeToRefs(tagsStore);

const rows = computed(() => {
	return tags.value.slice((filter.value.current_page - 1) * filter.value.page_size, filter.value.current_page * filter.value.page_size);
});

const deleteTag = async (id: number) => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: 'Are you sure you want to delete this tag?',
			action: 'delete',
			onConfirm: async () => {
				await tagsStore.deleteTag(id);
				confirmModal.close();
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

const selectTag = async (e: Event, row: TableRow<Tag>) => {
	const tag = row.original;
	if (!tag) return;

	const tagModal = overlay.create(ZModalTagDetail, {
		props: {
			tag: JSON.parse(JSON.stringify(tag)),
			onUpdate: async (tag: Tag) => {
				await tagsStore.updateTag(tag.id, tag);
				tagModal.close();
			},
			onDelete: async () => {
				tagModal.close();
				await deleteTag(tag.id);
			},
			onCancel: () => {
				tagModal.close();
			},
		},
	});

	tagModal.open();
};

const updatePage = async (page: number) => {
	await tagsStore.updatePage(page);
};

const exportTags = async () => {
	// await tagsStore.exportTags();
};
</script>

<style scoped>
.base {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 1.5rem;
	margin-top: 1rem;
}

@media (min-width: 640px) {
	.base {
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}
}

.section-empty {
	height: 13rem;
}

.section-empty div {
	text-align: center;
}

.section-empty h2 {
	font-size: 1.5rem;
	line-height: 2rem;
	font-weight: 600;
}

.section-empty p {
	color: var(--color-neutral-400);
}
</style>
