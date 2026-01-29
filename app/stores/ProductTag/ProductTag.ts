import { defineStore } from 'pinia';
import { options_page_size } from '~/utils/options';
import type { TagCreate } from '~/utils/types/form/tag-creation';
import type { Tag } from '~/utils/types/tag';
import { failedNotification, successNotification } from '../AppUi/AppUi';
import type { BaseODataReq } from '~/repository/base/base.req';

type TagFilter = {
	query: string;
	page_size: number;
	current_page: number;
};

const initialEmptyTag: TagCreate = {
	value: undefined,
};

const initialEmptyTagFilter: TagFilter = {
	query: '',
	page_size: options_page_size[0] as number,
	current_page: 1,
};

export const useProductTagStore = defineStore('productTagStore', {
	state: () => ({
		loading: false as boolean,
		adding: false as boolean,
		updating: false as boolean,
		exporting: false as boolean,
		tags: [] as Tag[],
		total_tags: 0 as number,
		new_tag: structuredClone(initialEmptyTag),
		filter: initialEmptyTagFilter,
		errors: [] as string[],
	}),
	actions: {
		resetNewTag() {
			this.new_tag = structuredClone(initialEmptyTag);
		},

		async updatePageSize(size: number) {
			this.filter.page_size = size;

			if (this.filter.page_size > this.tags.length) {
				this.filter.current_page = 1;
				return;
			}

			this.getTags();
		},

		async updatePage(page: number) {
			this.filter.current_page = page;

			if (this.filter.current_page < 0 || this.tags.length === this.total_tags) {
				return;
			}

			this.getTags();
		},

		async getTags() {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				const queryParams: BaseODataReq = {
					$top: this.filter.page_size,
					$count: true,
					$expand: 'products',
					$skip: (this.filter.current_page - 1) * this.filter.page_size,
					$orderby: 'updated_at desc',
				};

				if (this.filter.query) {
					const queryFilter = `(value contains '${this.filter.query}')`;
					queryParams.$filter = queryFilter;
				}

				const { data, '@odata.count': total } = await $api.tag.getMany(queryParams);

				if (data) {
					if (this.filter.current_page > 1 && this.total_tags > this.tags.length) {
						this.tags = [...this.tags, ...data];
					} else {
						this.tags = data;
					}

					this.total_tags = total ?? 0;
				}
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
			} finally {
				this.loading = false;
			}
		},

		async addTag(value: string): Promise<boolean> {
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
				return true;
			} catch (err: any) {
				console.error(err);
				failedNotification(err.message);
				return false;
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
