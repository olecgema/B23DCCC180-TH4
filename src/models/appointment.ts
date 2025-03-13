import moment from 'moment';
import type { Service } from './service';
import type { Employee } from './employee';

export interface Appointment {
	id?: string;
	date: string;
	time: string;
	employeeId: string;
	serviceId: string;
	status: string;
}

export interface AppointmentWithDetails extends Appointment {
	serviceName?: string;
	employeeName?: string;
	price?: number;
}

export function getAppointmentStatus(status: string): string {
	switch (status) {
		case 'Chờ xác nhận':
			return 'Chờ xác nhận';
		case 'Đã xác nhận':
			return 'Đã xác nhận';
		case 'Hoàn thành':
			return 'Hoàn thành';
		case 'Đã hủy':
			return 'Đã hủy';
		default:
			return 'Không xác định';
	}
}

export function getAppointmentsWithDetails(
	appointments: Appointment[],
	services: Service[],
	employees: Employee[],
): AppointmentWithDetails[] {
	return appointments.map((appointment) => {
		const service = services.find((s) => s.id === appointment.serviceId);
		const employee = employees.find((e) => e.id === appointment.employeeId);

		return {
			...appointment,
			serviceName: service?.name,
			employeeName: employee?.name,
			price: service?.price,
		};
	});
}

export function filterAppointmentsByDateRange(
	appointments: Appointment[],
	startDate?: moment.Moment,
	endDate?: moment.Moment,
): Appointment[] {
	if (!startDate || !endDate) return appointments;

	return appointments.filter((app) => {
		const appDate = moment(app.date);
		return appDate.isBetween(startDate, endDate, 'day', '[]');
	});
}

export function countAppointmentsByDate(appointments: Appointment[]): { date: string; count: number }[] {
	const result = appointments.reduce((acc, app) => {
		const date = app.date;
		const existing = acc.find((item) => item.date === date);
		if (existing) {
			existing.count += 1;
		} else {
			acc.push({ date, count: 1 });
		}
		return acc;
	}, [] as { date: string; count: number }[]);

	// Sắp xếp theo thứ tự thời gian
	return result.sort((a, b) => moment(a.date).diff(moment(b.date)));
}

export function countAppointmentsByMonth(appointments: Appointment[]): { month: string; count: number }[] {
	const result = appointments.reduce((acc, app) => {
		const month = moment(app.date).format('MM/YYYY');
		const existing = acc.find((item) => item.month === month);
		if (existing) {
			existing.count += 1;
		} else {
			acc.push({ month, count: 1 });
		}
		return acc;
	}, [] as { month: string; count: number }[]);

	// Sắp xếp theo thứ tự thời gian
	return result.sort((a, b) => moment(a.month, 'MM/YYYY').diff(moment(b.month, 'MM/YYYY')));
}
