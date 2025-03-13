export interface Service {
	id: string;
	name: string;
	price: number;
	workSchedule: string[];
}

export function calculateTotalRevenue(services: Service[], serviceIds: string[]): number {
	return services
		.filter((service) => serviceIds.includes(service.id))
		.reduce((total, service) => total + Number(service.price), 0);
}

export function getServiceById(services: Service[], id: string): Service | undefined {
	return services.find((service) => service.id === id);
}

export function getServicesByIds(services: Service[], ids: string[]): Service[] {
	return services.filter((service) => ids.includes(service.id));
}
