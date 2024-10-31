const prefix: string = '/api';
const prefixAuth: string = 'auth';

export const Routes = {
	ProductTag: {
		FetchAll: () => `${prefix}/product-tags`,
		FetchDetail: (id: number) => `${prefix}/product-tags/${id}`,
		CreatePost: () => `${prefix}/product-tags`,
	},
	Auth: {
		Login: () => `${prefixAuth}/merchant-user/login`,
	},
};
