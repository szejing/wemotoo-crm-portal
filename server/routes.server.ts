const auth: string = 'auth';
const prodCatg: string = 'product-category';
const prodTag: string = 'product-tag';
const prodOption: string = 'product-option';
const prod: string = 'product';

export const Routes = {
	Auth: {
		Login: () => `${auth}/merchant-user/login`,
		Logout: () => `${auth}/merchant-user/logout`,
	},
	Product: {
		Create: () => `${prod}/`,
		Single: (id: number) => `${prod}/${id}`,
		Many: () => `${prod}/`,
		Update: () => `${prod}/`,
		Remove: () => `${prod}/`,
		RevertRemove: () => `${prod}/`,
	},
	ProductTag: {
		Create: () => `${prodTag}/`,
		Single: (id: number) => `${prodTag}/${id}`,
		Many: () => `${prodTag}/`,
		Update: () => `${prodTag}/`,
		Remove: () => `${prodTag}/`,
		RevertRemove: () => `${prodTag}/`,
	},
	ProdCategory: {
		Create: () => `${prodCatg}/`,
		Single: (id: number) => `${prodCatg}/${id}`,
		Many: () => `${prodCatg}/`,
		Update: () => `${prodCatg}/`,
		Remove: () => `${prodCatg}/`,
		RevertRemove: () => `${prodCatg}/`,
	},
	ProdOption: {
		Create: () => `${prodOption}/`,
		Single: (id: number) => `${prodOption}/${id}`,
		Many: () => `${prodOption}/`,
		Update: () => `${prodOption}/`,
		Remove: () => `${prodOption}/`,
		RevertRemove: () => `${prodOption}/`,
	},
};

// export const Routes = {
// 	external: {
// 		name: '/api/another',
// 		regex: /^\/api\/another$/,
// 	},
// 	core: {
// 		name: '/api',
// 		regex: /^\/api\//,
// 	},
// };
