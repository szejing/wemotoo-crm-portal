<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="base">
			<div class="sm:col-span-2">
				<UCard>
					<h2>Add New Tag</h2>
					<FormProductTagCreation class="mt-4" />
				</UCard>
			</div>

			<div class="sm:col-span-4">
				<UCard>
					<ZSectionFilterTags />
					<div>
						<!-- Table  -->
						<UTable :data="rows" :columns="tag_columns" :loading="loading" @select-row="selectTag" />

						<!-- Pagination  -->
						<div v-if="tags.length > 0" class="section-pagination">
							<UPagination :default-page="current_page" :items-per-page="page_size" :total="total_tags" @update:page="updatePage" />
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalTagDetail } from '#components';
import { tag_columns } from '~/utils/table-columns';
import type { Tag } from '~/utils/types/tag';

const links = [
	{
		label: 'Products',
		icon: ICONS.LIST,
		to: '/products',
	},
	{
		label: 'All Tags',
		icon: ICONS.ADDITIONAL,
		to: '/products/tags',
	},
];

const overlay = useOverlay();
const tagsStore = useProductTagStore();
await tagsStore.getTags();

useHead({ title: 'Wemotoo CRM - Tags' });

const { loading, tags, total_tags, page_size, current_page } = storeToRefs(tagsStore);

const rows = computed(() => {
	return tags.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
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

const selectTag = async (tag: Tag) => {
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
