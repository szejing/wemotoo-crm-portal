import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { CreateAppointmentReq } from './models/request/create-appointment.req';
import type { UpdateAppointmentReq } from './models/request/update-appointment.req';
import type { AppointmentResp } from './models/response/appointment.resp';
import type { BaseODataReq } from '~/repository/base/base.req';
import type { BaseODataResp } from '~/repository/base/base.resp';
import type { Appointment } from '~/utils/types/appointment';

class AppointmentModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Appointments;

	async getMany(query: BaseODataReq): Promise<BaseODataResp<Appointment>> {
		return await this.call<BaseODataResp<Appointment>>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
		});
	}

	async getSingle(code: string) {
		return await this.call<any>({
			method: 'GET',
			url: `${this.RESOURCE.Single(code)}`,
		});
	}

	async create(appointment: CreateAppointmentReq): Promise<AppointmentResp> {
		return await this.call<any>({
			method: 'POST',
			url: `${this.RESOURCE.Create()}`,
			body: appointment,
		});
	}

	async update(code: string, appointment: UpdateAppointmentReq): Promise<AppointmentResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Update(code)}`,
			body: appointment,
		});
	}

	async delete(code: string): Promise<AppointmentResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(code)}`,
		});
	}

	async restore(code: string): Promise<AppointmentResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(code)}`,
		});
	}
}

export default AppointmentModule;
