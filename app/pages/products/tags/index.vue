<template>
	<UDashboardPanel id="products-tags">
		<template #header>
			<UDashboardNavbar :title="$t('nav.tags')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>

				<template #right>
					<ZCreateButton to="/products/tags/create" />
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
				<ZTableToolbar
					v-model="filter.page_size"
					:page-size-options="options_page_size"
					:export-enabled="true"
					:exporting="exporting"
					@update:model-value="tagsStore.updatePage"
					@export="exportTags"
				/>

				<UTable :data="tags" :columns="tag_columns" :loading="loading" @select="selectTag">
					<template #empty>
						<div class="flex flex-col items-center justify-center py-12 gap-3">
							<UIcon :name="ICONS.ADDITIONAL" class="w-12 h-12 text-gray-400" />
							<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noTagsFound') }}</p>
							<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
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
import { getTagColumns } from '~/utils/table-columns';
import type { Tag } from '~/utils/types/tag';
import { options_page_size } from '~/utils/options';
import type { TableRow } from '@nuxt/ui';
import { failedNotification } from '~/stores/AppUi/AppUi';

const overlay = useOverlay();
const tagsStore = useProductTagStore();

const { t } = useI18n();
const tag_columns = computed(() => getTagColumns(t));
useHead({ title: () => t('pages.tagsTitle') });

const { loading, tags, total_tags, filter, exporting } = storeToRefs(tagsStore);

onMounted(() => {
	tagsStore.getTags();
});

const deleteTag = async (row: TableRow<Tag>) => {
	const tag = row.original;

	const hasProducts = tag?.total_products && tag.total_products > 0;

	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: hasProducts ? t('pages.confirmDeleteTagWithProducts') : t('pages.confirmDeleteTag'),
			action: 'delete',
			onConfirm: async () => {
				await tagsStore.deleteTag(tag);
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

	if (tag.is_internal) {
		failedNotification(t('pages.internalTagsCannotBeEdited'));
		return;
	}

	const tagModal = overlay.create(ZModalTagDetail, {
		props: {
			tag: JSON.parse(JSON.stringify(tag)),
			onUpdate: async (tag: Tag) => {
				await tagsStore.updateTag(tag.id, tag);
				tagModal.close();
			},
			onDelete: async () => {
				tagModal.close();
				await deleteTag(row);
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
