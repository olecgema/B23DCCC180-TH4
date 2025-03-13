import axios from 'axios';
import type { Appointment } from '../models/appointment';

const API_URL = 'https://67d2592590e0670699bd2980.mockapi.io/lich-hen/Lich';

export async function fetchAppointments(): Promise<Appointment[]> {
	const response = await axios.get(API_URL);
	return response.data as Appointment[];
}

export async function createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
	const response = await axios.post(API_URL, appointment);
	return response.data as Appointment;
}

export async function updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
	const response = await axios.put(`${API_URL}/${id}`, appointment);
	return response.data as Appointment;
}

export async function deleteAppointment(id: string): Promise<void> {
	await axios.delete(`${API_URL}/${id}`);
}
