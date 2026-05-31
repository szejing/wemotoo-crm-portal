import HttpFactory from '~/repository/factory';
import MerchantRoutes from '~/repository/routes.client';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { CreateStaffDepartmentReq } from './request/create-staff-department.req';
import type { UpdateStaffDepartmentReq } from './request/update-staff-department.req';
import type { DeleteStaffDepartmentResp, StaffDepartmentResp, StaffDepartmentsResp } from './response/staff-department.resp';

class StaffDepartmentModule extends HttpFactory {
	private readonly RESOURCE = MerchantRoutes.StaffCommissions;

	async getMany(query?: BaseODataReq): Promise<StaffDepartmentsResp> {
		return await this.call<StaffDepartmentsResp>({
			method: 'GET',
			url: this.RESOURCE.Departments(),
			query,
		});
	}

	async getSingle(id: number): Promise<StaffDepartmentResp> {
		return await this.call<StaffDepartmentResp>({
			method: 'GET',
			url: this.RESOURCE.Department(id),
		});
	}

	async create(body: CreateStaffDepartmentReq): Promise<StaffDepartmentResp> {
		return await this.call<StaffDepartmentResp>({
			method: 'POST',
			url: this.RESOURCE.DepartmentCreate(),
			body,
		});
	}

	async update(id: number, body: UpdateStaffDepartmentReq): Promise<StaffDepartmentResp> {
		return await this.call<StaffDepartmentResp>({
			method: 'PATCH',
			url: this.RESOURCE.DepartmentUpdate(id),
			body,
		});
	}

	async delete(id: number): Promise<DeleteStaffDepartmentResp> {
		return await this.call<DeleteStaffDepartmentResp>({
			method: 'DELETE',
			url: this.RESOURCE.DepartmentDelete(id),
		});
	}
}

export default StaffDepartmentModule;
