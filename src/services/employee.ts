import axios from 'axios';
import type { Employee } from '../models/employee';

const API_URL = 'https://67d237fd90e0670699bcb276.mockapi.io/cuahang/Nhanvien';

export async function fetchEmployees(): Promise<Employee[]> {
	const response = await axios.get(API_URL);
	return response.data as Employee[];
}

export async function createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
	const response = await axios.post(API_URL, employee);
	return response.data as Employee;
}

export async function updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee> {
	const response = await axios.put(`${API_URL}/${id}`, employee);
	return response.data as Employee;
}

export async function deleteEmployee(id: string): Promise<void> {
	await axios.delete(`${API_URL}/${id}`);
}
