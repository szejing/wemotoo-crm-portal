/*
 * Prefix /api for api server
 */
const prefix: string = '/api';
const prefixAuth: string = 'auth';

/*
 * Prefix /api/another for another server
 * */

const Routes = {
	ProductTag: {
		FetchAll: () => `${prefix}/product-tags`,
		FetchDetail: (id: number) => `${prefix}/product-tags/${id}`,
		CreatePost: () => `${prefix}/product-tags`,
	},
	Auth: {
		Login: () => `${prefix}/${prefixAuth}/merchant-user/login`,
	},
};

export default Routes;
