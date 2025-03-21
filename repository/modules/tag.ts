import type { Tag } from '~/utils/types/tag';
import HttpFactory from '../factory';
import MerchantRoutes from '../routes.client';

export type TagsResp = {
	count: number;
	tags: Tag[];
};

export type CreateTagReq = {
	value: string;
};

export type CreateTagResp = {
	tag: Tag;
};

export type DeleteTagReq = {
	id: number;
};

export type DeleteTagResp = {
	tag: Tag;
};

export type UpdateTagReq = {
	value: string;
	metadata?: Record<string, any> | undefined;
};

export type UpdateTagResp = {
	tag: Tag;
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

	async create(tag: CreateTagReq): Promise<CreateTagResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: tag,
		});
	}

	async update(id: number, tag: UpdateTagReq): Promise<UpdateTagResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(id)}`,
			body: tag,
		});
	}

	async delete(tag: DeleteTagReq): Promise<DeleteTagResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(tag.id)}`,
		});
	}
}

export default TagModule;
