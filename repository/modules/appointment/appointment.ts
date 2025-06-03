import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { AppointmentReq } from './models/request/appointment.req';
import type { CreateAppointmentReq } from './models/request/create-appointment.req';
import type { UpdateAppointmentReq } from './models/request/update-appointment.req';
import type { AppointmentResp } from './models/response/appointment.resp';
import type { AppointmentsResp } from './models/response/appointments.resp';

class AppointmentModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Appointments;

	async fetchMany(): Promise<AppointmentsResp> {
		return await this.call<AppointmentsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
		});
	}

	async fetchSingle(code: string) {
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

	async delete(appointment: AppointmentReq): Promise<AppointmentResp> {
		return await this.call<any>({
			method: 'DELETE',
			url: `${this.RESOURCE.Delete(appointment.code)}`,
		});
	}

	async restore(appointment: AppointmentReq): Promise<AppointmentResp> {
		return await this.call<any>({
			method: 'PATCH',
			url: `${this.RESOURCE.Restore(appointment.code)}`,
		});
	}
}

export default AppointmentModule;
