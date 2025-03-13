import moment from 'moment';
import type { Appointment } from './appointment';
import type { Service } from './service';
import type { Employee } from './employee';

export interface RevenueStats {
	byService: { serviceId: string; serviceName: string; totalRevenue: number }[];
	byEmployee: { employeeId: string; employeeName: string; totalRevenue: number }[];
	byDate: { date: string; count: number }[];
	byMonth: { month: string; count: number }[];
}

export function calculateRevenueByService(
	appointments: Appointment[],
	services: Service[],
): { serviceId: string; serviceName: string; totalRevenue: number }[] {
	const completedAppointments = appointments.filter((app) => app.status === 'Hoàn thành');

	return completedAppointments.reduce((acc, app) => {
		const service = services.find((s) => s.id === app.serviceId);
		if (!service) return acc;

		const existing = acc.find((item) => item.serviceId === app.serviceId);
		if (existing) {
			existing.totalRevenue += Number(service.price);
		} else {
			acc.push({
				serviceId: app.serviceId,
				serviceName: service.name,
				totalRevenue: Number(service.price),
			});
		}
		return acc;
	}, [] as { serviceId: string; serviceName: string; totalRevenue: number }[]);
}

export function calculateRevenueByEmployee(
	appointments: Appointment[],
	services: Service[],
	employees: Employee[],
): { employeeId: string; employeeName: string; totalRevenue: number }[] {
	const completedAppointments = appointments.filter((app) => app.status === 'Hoàn thành');

	return completedAppointments.reduce((acc, app) => {
		const service = services.find((s) => s.id === app.serviceId);
		const employee = employees.find((e) => e.id === app.employeeId);
		if (!service || !employee) return acc;

		const existing = acc.find((item) => item.employeeId === app.employeeId);
		if (existing) {
			existing.totalRevenue += Number(service.price);
		} else {
			acc.push({
				employeeId: app.employeeId,
				employeeName: employee.name,
				totalRevenue: Number(service.price),
			});
		}
		return acc;
	}, [] as { employeeId: string; employeeName: string; totalRevenue: number }[]);
}

export function calculateRevenueStats(
	appointments: Appointment[],
	services: Service[],
	employees: Employee[],
	dateRange?: [moment.Moment, moment.Moment],
): RevenueStats {
	let filteredAppointments = appointments;

	// Lọc theo khoảng thời gian nếu có
	if (dateRange && dateRange[0] && dateRange[1]) {
		filteredAppointments = appointments.filter((app) => {
			const appDate = moment(app.date);
			return appDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');
		});
	}

	// Thống kê theo dịch vụ
	const revenueByService = calculateRevenueByService(filteredAppointments, services);

	// Thống kê theo nhân viên
	const revenueByEmployee = calculateRevenueByEmployee(filteredAppointments, services, employees);

	// Thống kê số lượng lịch hẹn theo ngày
	const appointmentsByDate = filteredAppointments.reduce((acc, app) => {
		const date = app.date;
		const existing = acc.find((item) => item.date === date);
		if (existing) {
			existing.count += 1;
		} else {
			acc.push({ date, count: 1 });
		}
		return acc;
	}, [] as { date: string; count: number }[]);

	// Thống kê số lượng lịch hẹn theo tháng
	const appointmentsByMonth = filteredAppointments.reduce((acc, app) => {
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
	appointmentsByDate.sort((a, b) => moment(a.date).diff(moment(b.date)));
	appointmentsByMonth.sort((a, b) => moment(a.month, 'MM/YYYY').diff(moment(b.month, 'MM/YYYY')));

	return {
		byService: revenueByService,
		byEmployee: revenueByEmployee,
		byDate: appointmentsByDate,
		byMonth: appointmentsByMonth,
	};
}
