import HttpFactory from '../../factory';
import MerchantRoutes from '../../routes.client';
import type { CreateAppointmentReq } from './models/request/create-appointment.req';
import type { UpdateAppointmentReq } from './models/request/update-appointment.req';
import type { AppointmentResp } from './models/response/appointment.resp';
import type { AppointmentsResp } from './models/response/appointments.resp';
import type { GetAppointmentsReq } from './models/request/get-appointments.req';

class AppointmentModule extends HttpFactory {
	private RESOURCE = MerchantRoutes.Appointments;

	async fetchMany(query: GetAppointmentsReq): Promise<AppointmentsResp> {
		return await this.call<AppointmentsResp>({
			method: 'GET',
			url: `${this.RESOURCE.Many()}`,
			query,
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
