import axios from 'axios';
import type { Service } from '../models/service';

const API_URL = 'https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Vieclam';

export async function fetchServices(): Promise<Service[]> {
	const response = await axios.get(API_URL);
	return response.data as Service[];
}

export async function createService(service: Omit<Service, 'id'>): Promise<Service> {
	const response = await axios.post(API_URL, service);
	return response.data as Service;
}

export async function updateService(id: string, service: Partial<Service>): Promise<Service> {
	const response = await axios.put(`${API_URL}/${id}`, service);
	return response.data as Service;
}

export async function deleteService(id: string): Promise<void> {
	await axios.delete(`${API_URL}/${id}`);
}
