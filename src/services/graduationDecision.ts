import axios from 'axios';
import { GraduationDecision, DiplomaBook } from '../models/graduationDecision';
import { API_ENDPOINTS } from '../constants/diploma';
import moment from 'moment';

export const GraduationDecisionService = {
	// Quyết định tốt nghiệp APIs
	getDecisions: async (): Promise<GraduationDecision[]> => {
		const response = await axios.get(API_ENDPOINTS.DECISION);
		return response.data;
	},

	createDecision: async (decision: Partial<GraduationDecision>): Promise<GraduationDecision> => {
		const response = await axios.post(API_ENDPOINTS.DECISION, {
			...decision,
			issuedDate: moment(decision.issuedDate).format('YYYY-MM-DD'),
		});
		return response.data;
	},

	updateDecision: async (id: string, decision: Partial<GraduationDecision>): Promise<GraduationDecision> => {
		const response = await axios.put(`${API_ENDPOINTS.DECISION}/${id}`, {
			...decision,
			issuedDate: moment(decision.issuedDate).format('YYYY-MM-DD'),
		});
		return response.data;
	},

	deleteDecision: async (id: string): Promise<void> => {
		await axios.delete(`${API_ENDPOINTS.DECISION}/${id}`);
	},

	// Sổ văn bằng APIs
	getDiplomaBooks: async (): Promise<DiplomaBook[]> => {
		const response = await axios.get(API_ENDPOINTS.DIPLOMA_BOOK);
		return response.data;
	},

	// Search APIs
	updateSearchCount: async (decisionId: string): Promise<void> => {
		try {
			const response = await axios.get(`${API_ENDPOINTS.DECISION}/${decisionId}`);
			const currentCount = response.data.searchCount || 0;
			await axios.put(`${API_ENDPOINTS.DECISION}/${decisionId}`, {
				searchCount: currentCount + 1,
			});
		} catch (error) {
			console.error('Lỗi khi cập nhật lượt tra cứu:', error);
		}
	},
};
