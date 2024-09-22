/*
 * Prefix /api for api server
 */
const prefix: string = '/api';

/*
 * Prefix /api/another for another server
 * */
const anotherPrefix: string = '/api/another';

const Routes = {
	ProductTag: {
		FetchAll: () => `${prefix}/product-tags`,
		FetchDetail: (id: number) => `${prefix}/product-tags/${id}`,
		CreatePost: () => `${prefix}/product-tags`,
	},
	Auth: {
		Login: () => `${anotherPrefix}/login`,
	},
};

export default Routes;
