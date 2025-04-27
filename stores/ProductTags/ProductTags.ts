import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { TagCreate } from '~/utils/types/form/tag-creation';
import type { Tag } from '~/utils/types/tag';
import { failedNotification, successNotification } from '../AppUi/AppUi';

const initialEmptyTag: TagCreate = {
	value: undefined,
};

export const useProductTagsStore = defineStore('productTagsStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		tags: [] as Tag[],
		newTag: structuredClone(initialEmptyTag),
		pageSize: options_page_size[0],
		errors: [] as string[],
	}),
	actions: {
		resetNewTag() {
			this.newTag = structuredClone(initialEmptyTag);
		},

		updatePageSize(size: number) {
			this.pageSize = size;
		},

		async getTags() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const data = await $api.tag.fetchMany();

				if (data.tags) {
					this.tags = data.tags;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async addTag(value: string) {
			this.adding = true;
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.tag.create({ value });

				if (data.tag) {
					successNotification(`${value} - Tag Created !`);
					this.tags.push(data.tag);
				}
				this.resetNewTag();
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.adding = false;
				this.loading = false;
			}
		},

		async updateTag(id: number, tag: Tag) {
			this.updating = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.tag.update(id, {
					value: tag.value,
				});

				if (data.tag) {
					successNotification(`Tag Updated !`);
					this.getTags();
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.updating = false;
			}
		},

		async deleteTag(id: number) {
			this.loading = true;

			const { $api } = useNuxtApp();

			try {
				const data = await $api.tag.delete({ id });

				if (data.tag.id) {
					successNotification(`Tag #${data.tag.value} Deleted !`);

					const index = this.tags.findIndex((t) => t.id === data.tag.id);
					this.tags.splice(index, 1);
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},
	},
});
