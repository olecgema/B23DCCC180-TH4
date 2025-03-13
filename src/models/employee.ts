import type { Service } from './service';

export interface Employee {
	id: string;
	name: string;
	maxCustomersPerDay: number;
	workSchedule: string[];
	services: string[];
}

export function getEmployeeById(employees: Employee[], id: string): Employee | undefined {
	return employees.find((employee) => employee.id === id);
}

export function getEmployeesByServiceId(employees: Employee[], serviceId: string): Employee[] {
	return employees.filter((employee) => employee.services.includes(serviceId));
}

export function getEmployeeServices(employee: Employee, services: Service[]): Service[] {
	return services.filter((service) => employee.services.includes(service.id));
}

export function isEmployeeAvailable(employee: Employee, date: string): boolean {
	// Chuyển đổi ngày thành thứ trong tuần (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
	const dayOfWeek = new Date(date).getDay();
	const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
	const dayName = dayNames[dayOfWeek];

	return employee.workSchedule.includes(dayName);
}
