import type { CRMUser } from '~/utils/types/crm-user';

export type CrmUserResp = {
	user: CRMUser;
};

export type CrmUsersResp = {
	count: number;
	users: CRMUser[];
};
