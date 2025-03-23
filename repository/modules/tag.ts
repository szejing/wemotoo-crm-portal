import type { Tag } from '~/utils/types/tag';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';

type BaseTagReq = {
	id: number;
};

type TagResp = {
	tag: Tag;
};

type TagsResp = {
	count: number;
	tags: Tag[];
};

type CreateTagReq = {
	value: string;
};

type UpdateTagReq = {
	value: string;
	metadata?: Record<string, any> | undefined;
};

class TagModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Tags;

	async fetchMany(): Promise<TagsResp> {
		return await this.call<TagsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async fetchSingle(id: number) {
		return await this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(id)}`,
		});
	}

	async create(tag: CreateTagReq): Promise<TagResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: tag,
		});
	}

	async update(id: number, tag: UpdateTagReq): Promise<TagResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(id)}`,
			body: tag,
		});
	}

	async delete(tag: BaseTagReq): Promise<TagResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(tag.id)}`,
		});
	}

	async restore(tag: BaseTagReq): Promise<TagResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(tag.id)}`,
		});
	}
}

export default TagModule;
