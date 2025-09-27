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
						<UTable :rows="rows" :columns="tag_columns" :loading="loading" @select="selectTag">
							<template #name-data="{ row }">
								<div>
									<h5 class="font-bold text-secondary-800">{{ row.name }}</h5>
								</div>
							</template>

							<template #total_items-header>
								<h5 class="text-center">No of Items</h5>
							</template>

							<template #total_items-data="{ row }">
								<h5 class="text-neutral-500 text-center">{{ row.total_products ?? 0 }}</h5>
							</template>

							<template #empty-state>
								<div class="flex-col-center section-empty">
									<h2>No Tags Found</h2>
									<p>Create a new tag to get started</p>
								</div>
							</template>
						</UTable>

						<!-- Pagination  -->
						<div v-if="tags.length > 0" class="section-pagination">
							<UPagination v-model="current_page" :page-count="page_size" :total="total_tags" @update:model-value="updatePage" />
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

const modal = useModal();
const tagsStore = useProductTagStore();
await tagsStore.getTags();

useHead({ title: 'Wemotoo CRM - Tags' });

watch(modal.isOpen, (value) => {
	if (!value) {
		modal.reset();
	}
});

const { loading, tags, total_tags, page_size, current_page } = storeToRefs(tagsStore);

const rows = computed(() => {
	return tags.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

const deleteTag = async (id: number) => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this tag?',
		action: 'delete',
		onConfirm: async () => {
			await tagsStore.deleteTag(id);
			modal.close();
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const selectTag = async (tag: Tag) => {
	if (!tag) return;

	modal.open(ZModalTagDetail, {
		tag: JSON.parse(JSON.stringify(tag)),
		onUpdate: async (tag: Tag) => {
			await tagsStore.updateTag(tag.id, tag);
			modal.close();
		},
		onDelete: async () => {
			await modal.close();
			await deleteTag(tag.id);
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const updatePage = async (page: number) => {
	await tagsStore.updatePage(page);
};
</script>

<style scoped lang="postcss">
.base {
	@apply container grid grid-cols-1 sm:grid-cols-6 gap-6 mt-4;
}

.section-empty {
	@apply h-52;
}

.section-empty div {
	@apply text-center;
}

.section-empty h2 {
	@apply text-2xl font-semibold;
}

.section-empty p {
	@apply text-gray-400;
}
</style>
